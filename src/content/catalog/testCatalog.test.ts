import { describe, expect, it } from "vitest";
import { contentCatalog } from "./catalog";
import { testCatalog } from "./testCatalog";
import { validateTestCatalog } from "./validateTestCatalog";

describe("piano dei test", () => {
  it("riferisce il listato ministeriale senza incorporarne i quesiti", () => {
    expect(validateTestCatalog(testCatalog, contentCatalog)).toEqual([]);
    const official = testCatalog.blueprints.find((item) => item.mode === "official-external");

    expect(official).toMatchObject({
      officialReferenceId: "ministero-patente-ab-2025-11",
      exerciseIds: []
    });
  });

  it("rifiuta quesiti incorporati in una verifica ministeriale esterna", () => {
    const invalid = structuredClone(testCatalog);
    const official = invalid.blueprints.find((item) => item.id === "verifica-ufficiale-ab");
    if (!official) throw new Error("Verifica ufficiale assente");
    official.exerciseIds.push("precedenza-destra-visuale-a");

    expect(validateTestCatalog(invalid, contentCatalog)).toContainEqual({
      path: "blueprints.verifica-ufficiale-ab.exerciseIds",
      message: "Una verifica ministeriale esterna non può includere quesiti nel pacchetto"
    });
  });
});
