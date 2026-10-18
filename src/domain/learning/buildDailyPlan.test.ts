import { describe, expect, it } from "vitest";
import { contentCatalog } from "../../content/catalog/catalog";
import { buildDailyPlan } from "./buildDailyPlan";
import { projectLearning } from "./projectLearning";
import type { LearningAttempt } from "./types";

describe("piano giornaliero", () => {
  it("propone un nuovo concetto a un profilo senza osservazioni", () => {
    const projection = projectLearning(
      [],
      contentCatalog.concepts.map((concept) => concept.id),
      contentCatalog.languageFeatures.map((feature) => feature.id)
    );
    const plan = buildDailyPlan({ catalog: contentCatalog, projection, now: "2026-10-18T10:00:00.000Z" });
    expect(plan.activities[0]).toMatchObject({ activityId: "lezione-precedenze-base", type: "lesson" });
    expect(plan.activities).toHaveLength(1);
  });

  it("mette un ripasso scaduto prima di un nuovo contenuto", () => {
    const attempt: LearningAttempt = {
      id: "attempt-1",
      activityId: "lezione-precedenze-base",
      exerciseId: "precedenza-destra-visuale-b",
      occurredAt: "2026-10-15T10:00:00.000Z",
      conceptIds: ["precedenza-destra"],
      languageFeatureIds: [],
      correct: true,
      independent: true,
      usedHelp: false,
      novelVariant: true
    };
    const projection = projectLearning(
      [attempt],
      contentCatalog.concepts.map((concept) => concept.id),
      contentCatalog.languageFeatures.map((feature) => feature.id)
    );
    const plan = buildDailyPlan({ catalog: contentCatalog, projection, now: "2026-10-18T10:00:00.000Z" });
    expect(plan.activities[0]).toMatchObject({ activityId: "ripasso-precedenze-base", type: "review" });
    expect(plan.activities.length).toBeLessThanOrEqual(3);
  });

  it("non ripropone le attività già completate", () => {
    const projection = projectLearning(
      [],
      contentCatalog.concepts.map((concept) => concept.id),
      contentCatalog.languageFeatures.map((feature) => feature.id)
    );
    const plan = buildDailyPlan({
      catalog: contentCatalog,
      projection,
      now: "2026-10-18T10:00:00.000Z",
      completedActivityIds: ["precedenze-base"]
    });

    expect(plan.activities).not.toContainEqual(
      expect.objectContaining({ activityId: "lezione-precedenze-base" })
    );
  });
});
