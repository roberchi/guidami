import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { LearningProfile } from "../../domain/models";
import { db } from "./GuidamiDatabase";
import { learningRepository } from "./LearningRepository";

const profile: LearningProfile = {
  id: "profile-test",
  createdAt: "2026-10-18T10:00:00.000Z",
  assessmentCompletedAt: "2026-10-18T10:00:00.000Z",
  level: "building",
  confidence: "iniziale",
  strengths: ["Osservazione iniziale"],
  focusAreas: ["Precedenze"]
};

describe("repository locale", () => {
  beforeEach(async () => {
    db.close();
    await db.delete();
    await db.open();
  });

  afterEach(async () => {
    db.close();
    await db.delete();
  });

  it("inizializza lo schema corrente senza dati preesistenti", async () => {
    const snapshot = await learningRepository.load();
    expect(snapshot.schemaVersion).toBe(2);
    expect(snapshot.learning.attempts).toEqual([]);
    expect(snapshot.learning.projection.conceptMastery["precedenza-destra"].level).toBe("unobserved");
  });

  it("salva atomicamente completamento, tentativo, evento e ripasso", async () => {
    await learningRepository.saveAssessment({ confidence: "some" }, profile);
    const snapshot = await learningRepository.completeLesson("precedenze-base");

    expect(snapshot.learning.attempts).toHaveLength(1);
    expect(snapshot.learning.projection.conceptMastery["precedenza-destra"].level).toBe("emerging");
    expect(await db.attempts.count()).toBe(1);
    expect(await db.events.count()).toBe(2);
    expect(await db.reviews.where("key").equals("precedenza-destra").count()).toBe(1);
  });

  it("esporta e reimporta il formato versionato", async () => {
    await learningRepository.saveAssessment({}, profile);
    await learningRepository.completeLesson("precedenze-base");
    const backup = await learningRepository.exportData();
    await learningRepository.deleteLocalData();

    const restored = await learningRepository.importData(backup);
    expect(restored.schemaVersion).toBe(2);
    expect(restored.profile?.id).toBe(profile.id);
    expect(restored.learning.attempts).toHaveLength(1);
  });

  it("rifiuta copie di sicurezza prive della struttura locale richiesta", async () => {
    await expect(learningRepository.importData(JSON.stringify({
      product: "guidami",
      schemaVersion: 2,
      snapshot: { preferences: {} },
      events: []
    }))).rejects.toThrow("copia di sicurezza Guidami compatibile");
  });
});
