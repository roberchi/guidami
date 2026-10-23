import { describe, expect, it } from "vitest";
import { contentCatalog } from "../../content/catalog/catalog";
import { testCatalog } from "../../content/catalog/testCatalog";
import { emptyLearningProjection } from "./types";
import { selectNextTest } from "./selectTest";

describe("selezione dei test", () => {
  it("prioritizza un test redazionale con concetti da consolidare", () => {
    const projection = structuredClone(emptyLearningProjection);
    projection.conceptMastery = {
      "precedenza-destra": { key: "precedenza-destra", dimension: "concept", level: "needs-support", confidence: "initial", observationCount: 2, independentCorrectCount: 0, assistedCorrectCount: 0, incorrectCount: 2, distinctExerciseCount: 1, delayedConfirmationCount: 0 },
      "incrocio-senza-segnali": { key: "incrocio-senza-segnali", dimension: "concept", level: "emerging", confidence: "initial", observationCount: 2, independentCorrectCount: 1, assistedCorrectCount: 0, incorrectCount: 1, distinctExerciseCount: 2, delayedConfirmationCount: 0 }
    };

    expect(selectNextTest({ contentCatalog, testCatalog, projection, attempts: [] })).toMatchObject({
      blueprint: { id: "fondamenti-precedenze" },
      exerciseIds: ["precedenza-destra-visuale-a", "precedenza-destra-visuale-b", "precedenza-destra-visuale-c"]
    });
  });

  it("non assegna la prova ministeriale prima di evidenze editoriali sufficienti", () => {
    const projection = structuredClone(emptyLearningProjection);
    projection.conceptMastery = {
      "precedenza-destra": { key: "precedenza-destra", dimension: "concept", level: "developing", confidence: "moderate", observationCount: 4, independentCorrectCount: 3, assistedCorrectCount: 0, incorrectCount: 1, distinctExerciseCount: 3, delayedConfirmationCount: 0 }
    };

    expect(selectNextTest({
      contentCatalog,
      testCatalog,
      projection,
      attempts: [],
      completedTestIds: ["fondamenti-precedenze", "lettura-regole-base", "segnali-pericolo-base"]
    })).toBeUndefined();
  });
});
