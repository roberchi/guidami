import { describe, expect, it } from "vitest";
import { contentCatalog } from "./catalog";
import type { ContentCatalog } from "./types";
import { validateCatalog } from "./validateCatalog";

describe("catalogo dei contenuti", () => {
  it("pubblica un catalogo pilota coerente", () => {
    expect(validateCatalog(contentCatalog)).toEqual([]);
    expect(contentCatalog.exercises.every((exercise) => exercise.origin === "editorial")).toBe(true);
  });

  it("copre ogni concetto pilota e ogni caratteristica linguistica con un esercizio", () => {
    for (const concept of contentCatalog.concepts) {
      expect(
        contentCatalog.exercises.some((exercise) => exercise.conceptIds.includes(concept.id)),
        `Concetto senza esercizio: ${concept.id}`
      ).toBe(true);
    }
    for (const feature of contentCatalog.languageFeatures) {
      expect(
        contentCatalog.exercises.some((exercise) => exercise.languageFeatureIds.includes(feature.id)),
        `Caratteristica linguistica senza esercizio: ${feature.id}`
      ).toBe(true);
    }
  });

  it("rifiuta una domanda dichiarata ufficiale senza fonte verificata", () => {
    const invalid: ContentCatalog = structuredClone(contentCatalog);
    invalid.exercises.push({
      ...structuredClone(contentCatalog.exercises[0]),
      id: "finta-domanda-ufficiale",
      kind: "official-question",
      origin: "official",
      source: undefined
    });

    expect(validateCatalog(invalid)).toContainEqual({
      path: "exercises.finta-domanda-ufficiale.source",
      message: "Una domanda ufficiale richiede provenienza e fonte",
      severity: "error"
    });
  });
});
