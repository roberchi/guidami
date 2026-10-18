import { describe, expect, it } from "vitest";
import { migrateSnapshot } from "./migrateSnapshot";

describe("migrazione dello stato locale", () => {
  it("porta uno stato MVP alla versione corrente senza perdere i progressi", () => {
    const migrated = migrateSnapshot({
      profile: { id: "profile-1", createdAt: "2026-10-01", level: "building", confidence: "iniziale", strengths: [], focusAreas: [] },
      assessmentAnswers: { confidence: "some" },
      preferences: { textSize: "large", highContrast: true, reducedMotion: false, speechRate: 0.8 },
      progress: { completedLessons: ["precedenze-base"], lessonStep: 2, streakDays: 1 },
      sync: { mode: "local", pendingBatchIds: [], status: "local" }
    });

    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.profile?.id).toBe("profile-1");
    expect(migrated.progress.completedLessons).toEqual(["precedenze-base"]);
    expect(migrated.learning.attempts).toEqual([]);
    expect(migrated.learning.projection.projectorVersion).toBe(1);
    expect(migrated.assessmentAnswers).toEqual({ confidence: "some" });
    expect(migrated.assessmentSession).toBeNull();
  });

  it("ripristina valori sicuri quando il contenuto è incompleto", () => {
    const migrated = migrateSnapshot({ preferences: null, progress: { completedLessons: "non-valido" } });
    expect(migrated.preferences.textSize).toBe("standard");
    expect(migrated.progress.completedLessons).toEqual([]);
  });
});
