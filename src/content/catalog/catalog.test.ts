import { describe, expect, it } from "vitest";
import { contentCatalog } from "./catalog";
import type { ContentCatalog } from "./types";
import { validateCatalog } from "./validateCatalog";

describe("catalogo dei contenuti", () => {
  it("pubblica un catalogo pilota coerente", () => {
    expect(validateCatalog(contentCatalog)).toEqual([]);
    expect(contentCatalog.exercises.every((exercise) => exercise.origin === "editorial")).toBe(true);
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
