import { describe, expect, it } from "vitest";
import type { LearningAttempt } from "./types";
import { projectLearning } from "./projectLearning";

function attempt(overrides: Partial<LearningAttempt> = {}): LearningAttempt {
  return {
    id: "attempt-1",
    activityId: "lezione-precedenze-base",
    exerciseId: "precedenza-destra-visuale-a",
    occurredAt: "2026-10-01T10:00:00.000Z",
    conceptIds: ["precedenza-destra"],
    languageFeatureIds: [],
    correct: true,
    independent: true,
    usedHelp: false,
    novelVariant: true,
    ...overrides
  };
}

describe("proiezione dell’apprendimento", () => {
  it("non consolida un concetto dopo una sola risposta", () => {
    const projection = projectLearning([attempt()], ["precedenza-destra"], []);
    expect(projection.conceptMastery["precedenza-destra"].level).toBe("emerging");
    expect(projection.conceptMastery["precedenza-destra"].confidence).toBe("insufficient");
    expect(projection.reviews[0].dueAt).toBe("2026-10-02T10:00:00.000Z");
  });

  it("richiede varianti e una conferma differita per consolidare", () => {
    const attempts = [
      attempt(),
      attempt({ id: "attempt-2", exerciseId: "precedenza-destra-visuale-b", occurredAt: "2026-10-01T10:05:00.000Z" }),
      attempt({ id: "attempt-3", exerciseId: "precedenza-destra-visuale-a", occurredAt: "2026-10-03T10:00:00.000Z" }),
      attempt({ id: "attempt-4", exerciseId: "precedenza-destra-visuale-b", occurredAt: "2026-10-05T10:00:00.000Z" })
    ];
    const projection = projectLearning(attempts, ["precedenza-destra"], []);
    expect(projection.conceptMastery["precedenza-destra"].level).toBe("consolidating");
    expect(projection.conceptMastery["precedenza-destra"].delayedConfirmationCount).toBeGreaterThan(0);
  });

  it("pesa separatamente le risposte assistite", () => {
    const projection = projectLearning([
      attempt({ independent: false, usedHelp: true }),
      attempt({ id: "attempt-2", independent: false, usedHelp: true })
    ], ["precedenza-destra"], []);
    const estimate = projection.conceptMastery["precedenza-destra"];
    expect(estimate.independentCorrectCount).toBe(0);
    expect(estimate.assistedCorrectCount).toBe(2);
    expect(estimate.level).toBe("emerging");
  });

  it("non fa avanzare il ripasso con la ripetizione letterale dello stesso esercizio", () => {
    const projection = projectLearning([
      attempt(),
      attempt({ id: "attempt-2", occurredAt: "2026-10-03T10:00:00.000Z", novelVariant: false })
    ], ["precedenza-destra"], []);
    expect(projection.conceptMastery["precedenza-destra"].distinctExerciseCount).toBe(1);
    expect(projection.conceptMastery["precedenza-destra"].level).toBe("emerging");
    expect(projection.reviews[0].intervalIndex).toBe(0);
  });

  it("riporta il ripasso all’intervallo iniziale dopo un errore", () => {
    const projection = projectLearning([
      attempt(),
      attempt({ id: "attempt-2", occurredAt: "2026-10-02T10:00:00.000Z" }),
      attempt({ id: "attempt-3", occurredAt: "2026-10-05T10:00:00.000Z", correct: false })
    ], ["precedenza-destra"], []);
    expect(projection.reviews[0]).toMatchObject({ intervalIndex: 0, reason: "recovery" });
    expect(projection.reviews[0].dueAt).toBe("2026-10-06T10:00:00.000Z");
  });
});
