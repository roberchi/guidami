import type {
  AppSnapshot,
  LearningEvent,
  LearningProfile,
  Preferences
} from "../../domain/models";
import { defaultSnapshot } from "../../domain/models";
import type { LearningAttempt } from "../../domain/learning/types";
import { contentCatalog } from "../../content/catalog/catalog";
import { projectLearning } from "../../domain/learning/projectLearning";
import { db } from "./GuidamiDatabase";
import { isSnapshotCandidate, migrateSnapshot } from "./migrateSnapshot";

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

function project(attempts: LearningAttempt[]) {
  return projectLearning(
    attempts,
    contentCatalog.concepts.map((concept) => concept.id),
    contentCatalog.languageFeatures.map((feature) => feature.id)
  );
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
    const snapshot = stored ? migrateSnapshot(stored.value) : cloneDefaultSnapshot();
    const storedAttempts = await db.attempts.toArray();
    const attempts = storedAttempts.length > 0 ? storedAttempts : snapshot.learning.attempts;
    const migrated: AppSnapshot = {
      ...snapshot,
      learning: {
        attempts,
        projection: project(attempts)
      }
    };
    const storedVersion = stored?.value && typeof stored.value === "object"
      ? (stored.value as { schemaVersion?: unknown }).schemaVersion
      : undefined;
    if (stored && storedVersion !== 2) await putSnapshot(migrated);
    return migrated;
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
      schemaVersion: 2,
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
    const exerciseId = "precedenza-destra-visuale-b";
    const attempt: LearningAttempt = {
      id: id("attempt"),
      activityId: "lezione-precedenze-base",
      exerciseId,
      occurredAt: now,
      conceptIds: ["precedenza-destra", "incrocio-senza-segnali"],
      languageFeatureIds: [],
      correct: true,
      independent: true,
      usedHelp: false,
      novelVariant: !current.learning.attempts.some((item) => item.exerciseId === exerciseId)
    };
    const attempts = [...current.learning.attempts, attempt];
    const projection = project(attempts);
    const event: LearningEvent = {
      id: id("event"),
      deviceId,
      studentProfileId: current.profile.id,
      type: "lesson.completed",
      occurredAt: now,
      schemaVersion: 2,
      payload: { lessonId, attempt }
    };
    const next: AppSnapshot = {
      ...current,
      progress: {
        completedLessons,
        lessonStep: 0,
        streakDays: Math.max(1, current.progress.streakDays),
        lastActivityAt: now
      },
      learning: { attempts, projection }
    };
    await db.transaction("rw", db.events, db.records, db.attempts, db.reviews, async () => {
      await db.events.add(event);
      await db.attempts.add(attempt);
      await db.reviews.bulkPut(projection.reviews);
      await putSnapshot(next);
    });
    return next;
  },

  async saveLearningAttempt(attempt: LearningAttempt): Promise<AppSnapshot> {
    const current = await this.load();
    if (!current.profile) throw new Error("Profilo locale non disponibile");
    if (current.learning.attempts.some((item) => item.id === attempt.id)) return current;
    const deviceId = await getDeviceId();
    const attempts = [...current.learning.attempts, attempt];
    const projection = project(attempts);
    const event: LearningEvent = {
      id: id("event"),
      deviceId,
      studentProfileId: current.profile.id,
      type: "learning.attempted",
      occurredAt: attempt.occurredAt,
      schemaVersion: 2,
      payload: attempt
    };
    const next: AppSnapshot = {
      ...current,
      progress: { ...current.progress, lastActivityAt: attempt.occurredAt },
      learning: { attempts, projection }
    };
    await db.transaction("rw", db.events, db.records, db.attempts, db.reviews, async () => {
      await db.events.add(event);
      await db.attempts.add(attempt);
      await db.reviews.bulkPut(projection.reviews);
      await putSnapshot(next);
    });
    return next;
  },

  async exportData(): Promise<string> {
    const snapshot = await this.load();
    const events = await db.events.toArray();
    return JSON.stringify(
      { product: "guidami", schemaVersion: 2, exportedAt: new Date().toISOString(), snapshot, events },
      null,
      2
    );
  },

  async importData(serialized: string): Promise<AppSnapshot> {
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object") throw new Error("File non valido");
    const backup = parsed as { product?: unknown; schemaVersion?: unknown; snapshot?: unknown; events?: unknown };
    if (
      backup.product !== "guidami" ||
      (backup.schemaVersion !== 1 && backup.schemaVersion !== 2) ||
      !isSnapshotCandidate(backup.snapshot)
    ) {
      throw new Error("Questo file non è una copia di sicurezza Guidami compatibile");
    }
    const snapshot = migrateSnapshot(backup.snapshot);
    const events = Array.isArray(backup.events) ? (backup.events as LearningEvent[]) : [];
    await db.transaction("rw", db.events, db.records, db.attempts, db.reviews, async () => {
      await db.events.bulkPut(events);
      await db.attempts.bulkPut(snapshot.learning.attempts);
      await db.reviews.bulkPut(snapshot.learning.projection.reviews);
      await putSnapshot(snapshot);
    });
    return snapshot;
  },

  async deleteLocalData(): Promise<void> {
    await db.transaction("rw", db.events, db.records, db.attempts, db.reviews, async () => {
      await db.events.clear();
      await db.records.clear();
      await db.attempts.clear();
      await db.reviews.clear();
    });
  }
};
