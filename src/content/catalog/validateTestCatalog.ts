import type { ContentCatalog, TestCatalog } from "./types";

export interface TestCatalogValidationIssue {
  path: string;
  message: string;
}

export function validateTestCatalog(
  testCatalog: TestCatalog,
  contentCatalog: ContentCatalog
): TestCatalogValidationIssue[] {
  const issues: TestCatalogValidationIssue[] = [];
  const referenceIds = new Set(testCatalog.officialReferences.map((reference) => reference.id));
  const exerciseIds = new Set(contentCatalog.exercises.map((exercise) => exercise.id));

  for (const blueprint of testCatalog.blueprints) {
    if (blueprint.selection.minimumItems > blueprint.selection.maximumItems) {
      issues.push({ path: `blueprints.${blueprint.id}.selection`, message: "Numero minimo superiore al massimo" });
    }
    for (const exerciseId of blueprint.exerciseIds) {
      if (!exerciseIds.has(exerciseId)) {
        issues.push({ path: `blueprints.${blueprint.id}.exerciseIds`, message: "Esercizio editoriale inesistente" });
      }
    }
    if (blueprint.mode === "official-external") {
      const reference = blueprint.officialReferenceId
        ? testCatalog.officialReferences.find((item) => item.id === blueprint.officialReferenceId)
        : undefined;
      if (!blueprint.officialReferenceId || !referenceIds.has(blueprint.officialReferenceId) || !reference) {
        issues.push({ path: `blueprints.${blueprint.id}.officialReferenceId`, message: "Riferimento ministeriale inesistente" });
      } else if (reference.accessMode !== "external-link-only" && reference.licenseStatus !== "verified") {
        issues.push({ path: `officialReferences.${reference.id}`, message: "Un listato senza licenza verificata può essere solo collegato esternamente" });
      }
      if (blueprint.exerciseIds.length > 0) {
        issues.push({ path: `blueprints.${blueprint.id}.exerciseIds`, message: "Una verifica ministeriale esterna non può includere quesiti nel pacchetto" });
      }
    } else if (blueprint.officialReferenceId) {
      issues.push({ path: `blueprints.${blueprint.id}.officialReferenceId`, message: "Un test didattico non richiede una fonte ministeriale" });
    }
  }

  return issues;
}
