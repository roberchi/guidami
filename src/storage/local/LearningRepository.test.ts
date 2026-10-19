import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { LearningProfile } from "../../domain/models";
import {
  advanceAssessmentSession,
  createAssessmentSession,
  pauseAssessmentSession,
  recordAssessmentAnswer
} from "../../domain/assessment/assessment";
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

const completedAssessment = {
  ...createAssessmentSession({ sessionId: "assessment-test", now: "2026-10-18T10:00:00.000Z" }),
  status: "completed" as const,
  completedAt: "2026-10-18T10:05:00.000Z",
  updatedAt: "2026-10-18T10:05:00.000Z"
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
    expect(snapshot.schemaVersion).toBe(4);
    expect(snapshot.learning.attempts).toEqual([]);
    expect(snapshot.learning.projection.conceptMastery["precedenza-destra"].level).toBe("unobserved");
  });

  it("salva atomicamente completamento, tentativo, evento e ripasso", async () => {
    await learningRepository.saveAssessment(completedAssessment, profile);
    const snapshot = await learningRepository.saveActivityAnswer({
      activityId: "lezione-precedenze-base",
      exerciseId: "precedenza-destra-visuale-b",
      selectedOptionId: "me",
      usedHelp: false
    });

    expect(snapshot.learning.attempts).toHaveLength(1);
    expect(snapshot.learning.projection.conceptMastery["precedenza-destra"].level).toBe("emerging");
    expect(await db.attempts.count()).toBe(1);
    expect(await db.events.count()).toBe(2);
    expect(await db.reviews.where("key").equals("precedenza-destra").count()).toBe(1);
  });

  it("esporta e reimporta il formato versionato", async () => {
    await learningRepository.saveAssessment(completedAssessment, profile);
    await learningRepository.saveActivityAnswer({
      activityId: "lezione-precedenze-base",
      exerciseId: "precedenza-destra-visuale-b",
      selectedOptionId: "me",
      usedHelp: false
    });
    const backup = await learningRepository.exportData();
    await learningRepository.deleteLocalData();

    const restored = await learningRepository.importData(backup);
    expect(restored.schemaVersion).toBe(4);
    expect(restored.profile?.id).toBe(profile.id);
    expect(restored.learning.attempts).toHaveLength(1);
  });

  it("rifiuta copie di sicurezza prive della struttura locale richiesta", async () => {
    await expect(learningRepository.importData(JSON.stringify({
      product: "guidami",
      schemaVersion: 4,
      snapshot: { preferences: {} },
      events: []
    }))).rejects.toThrow("copia di sicurezza Guidami compatibile");
  });

  it("salva separatamente una risposta assistita senza accreditarla come autonoma", async () => {
    await learningRepository.saveAssessment(completedAssessment, profile);
    const snapshot = await learningRepository.saveActivityAnswer({
      activityId: "lezione-precedenze-base",
      exerciseId: "precedenza-destra-visuale-b",
      selectedOptionId: "me",
      usedHelp: true
    });

    expect(snapshot.learning.attempts[0]).toMatchObject({
      correct: true,
      independent: false,
      usedHelp: true
    });
    expect(snapshot.learning.projection.conceptMastery["precedenza-destra"]).toMatchObject({
      independentCorrectCount: 0,
      assistedCorrectCount: 1
    });
  });

  it("rifiuta il completamento di un’attività successiva fuori sequenza", async () => {
    await learningRepository.saveAssessment(completedAssessment, profile);

    await expect(learningRepository.saveActivityAnswer({
      activityId: "linguaggio-verbi-modali",
      exerciseId: "linguaggio-puo-deve-a",
      selectedOptionId: "obligation",
      usedHelp: false
    })).rejects.toThrow("Completa prima le attività precedenti");
  });

  it("ripristina domanda corrente, risposta e interruzione della sessione", async () => {
    let session = createAssessmentSession({
      sessionId: "assessment-ripresa",
      now: "2026-10-18T10:00:00.000Z"
    });
    session = recordAssessmentAnswer(session, "audio", "2026-10-18T10:00:04.000Z");
    session = advanceAssessmentSession(session, "2026-10-18T10:00:05.000Z");
    session = pauseAssessmentSession(session, "2026-10-18T10:00:08.000Z");

    await learningRepository.saveAssessmentSession(session);
    const restored = await learningRepository.load();

    expect(restored.assessmentSession?.status).toBe("paused");
    expect(restored.assessmentSession?.currentQuestionId).toBe("study-rhythm");
    expect(restored.assessmentSession?.observations["reading-comfort"].selectedValue).toBe("audio");
    expect(restored.assessmentSession?.interruptionCount).toBe(1);
  });
});
