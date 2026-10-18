import type {
  AppSnapshot,
  LearningEvent,
  LearningProfile,
  Preferences
} from "../../domain/models";
import { defaultSnapshot } from "../../domain/models";
import { db } from "./GuidamiDatabase";

const SNAPSHOT_KEY = "app-snapshot";
const DEVICE_KEY = "device-id";

function id(prefix: string): string {
  const value = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${value}`;
}

function cloneDefaultSnapshot(): AppSnapshot {
  return structuredClone(defaultSnapshot);
}

function isSnapshot(value: unknown): value is AppSnapshot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AppSnapshot>;
  return Boolean(candidate.preferences && candidate.progress && candidate.sync);
}

async function getDeviceId(): Promise<string> {
  const existing = await db.records.get(DEVICE_KEY);
  if (typeof existing?.value === "string") return existing.value;
  const deviceId = id("device");
  await db.records.put({ key: DEVICE_KEY, value: deviceId, updatedAt: new Date().toISOString() });
  return deviceId;
}

async function putSnapshot(snapshot: AppSnapshot): Promise<void> {
  await db.records.put({ key: SNAPSHOT_KEY, value: snapshot, updatedAt: new Date().toISOString() });
}

export const learningRepository = {
  async load(): Promise<AppSnapshot> {
    const stored = await db.records.get(SNAPSHOT_KEY);
    return isSnapshot(stored?.value) ? stored.value : cloneDefaultSnapshot();
  },

  async saveAssessment(
    answers: Record<string, string>,
    profile: LearningProfile
  ): Promise<AppSnapshot> {
    const deviceId = await getDeviceId();
    const current = await this.load();
    const event: LearningEvent = {
      id: id("event"),
      deviceId,
      studentProfileId: profile.id,
      type: "assessment.completed",
      occurredAt: new Date().toISOString(),
      schemaVersion: 1,
      payload: { answers, profile }
    };
    const next: AppSnapshot = { ...current, profile, assessmentAnswers: answers };

    await db.transaction("rw", db.events, db.records, async () => {
      await db.events.add(event);
      await putSnapshot(next);
    });
    return next;
  },

  async saveAssessmentDraft(answers: Record<string, string>): Promise<AppSnapshot> {
    const current = await this.load();
    const next = { ...current, assessmentAnswers: answers };
    await putSnapshot(next);
    return next;
  },

  async savePreferences(preferences: Preferences): Promise<AppSnapshot> {
    const current = await this.load();
    const next = { ...current, preferences };
    await putSnapshot(next);
    return next;
  },

  async saveLessonCheckpoint(step: number): Promise<AppSnapshot> {
    const current = await this.load();
    const next = { ...current, progress: { ...current.progress, lessonStep: step } };
    await putSnapshot(next);
    return next;
  },

  async completeLesson(lessonId: string): Promise<AppSnapshot> {
    const current = await this.load();
    if (!current.profile) throw new Error("Profilo locale non disponibile");
    const deviceId = await getDeviceId();
    const now = new Date().toISOString();
    const completedLessons = Array.from(new Set([...current.progress.completedLessons, lessonId]));
    const event: LearningEvent = {
      id: id("event"),
      deviceId,
      studentProfileId: current.profile.id,
      type: "lesson.completed",
      occurredAt: now,
      schemaVersion: 1,
      payload: { lessonId, independent: true }
    };
    const next: AppSnapshot = {
      ...current,
      progress: {
        completedLessons,
        lessonStep: 0,
        streakDays: Math.max(1, current.progress.streakDays),
        lastActivityAt: now
      }
    };
    await db.transaction("rw", db.events, db.records, async () => {
      await db.events.add(event);
      await putSnapshot(next);
    });
    return next;
  },

  async exportData(): Promise<string> {
    const snapshot = await this.load();
    const events = await db.events.toArray();
    return JSON.stringify(
      { product: "guidami", schemaVersion: 1, exportedAt: new Date().toISOString(), snapshot, events },
      null,
      2
    );
  },

  async importData(serialized: string): Promise<AppSnapshot> {
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object") throw new Error("File non valido");
    const backup = parsed as { product?: unknown; schemaVersion?: unknown; snapshot?: unknown; events?: unknown };
    if (backup.product !== "guidami" || backup.schemaVersion !== 1 || !isSnapshot(backup.snapshot)) {
      throw new Error("Questo file non è una copia di sicurezza Guidami compatibile");
    }
    const events = Array.isArray(backup.events) ? (backup.events as LearningEvent[]) : [];
    await db.transaction("rw", db.events, db.records, async () => {
      await db.events.bulkPut(events);
      await putSnapshot(backup.snapshot as AppSnapshot);
    });
    return backup.snapshot;
  },

  async deleteLocalData(): Promise<void> {
    await db.transaction("rw", db.events, db.records, async () => {
      await db.events.clear();
      await db.records.clear();
    });
  }
};
