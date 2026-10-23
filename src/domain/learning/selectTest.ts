import type { ContentCatalog, TestBlueprint, TestCatalog } from "../../content/catalog/types";
import type { LearningAttempt, LearningProjection } from "./types";

export interface SelectedTest {
  blueprint: TestBlueprint;
  exerciseIds: string[];
  reason: string;
}

interface SelectNextTestInput {
  contentCatalog: ContentCatalog;
  testCatalog: TestCatalog;
  projection: LearningProjection;
  attempts: LearningAttempt[];
  completedTestIds?: string[];
}

function scoreLevel(level: "unobserved" | "needs-support" | "emerging" | "developing" | "consolidating" | undefined): number {
  if (level === "needs-support") return 8;
  if (level === "emerging") return 5;
  if (level === "unobserved") return 4;
  if (level === "developing") return 1;
  return 0;
}

function blueprintScore(blueprint: TestBlueprint, projection: LearningProjection): number {
  const concepts = blueprint.conceptIds.reduce(
    (total, id) => total + scoreLevel(projection.conceptMastery[id]?.level),
    0
  );
  const language = blueprint.languageFeatureIds.reduce(
    (total, id) => total + scoreLevel(projection.languageMastery[id]?.level),
    0
  );
  return concepts + language;
}

function hasNovelExercise(blueprint: TestBlueprint, attempts: LearningAttempt[]): boolean {
  const encountered = new Set(attempts.map((attempt) => attempt.exerciseId));
  return blueprint.exerciseIds.some((exerciseId) => !encountered.has(exerciseId));
}

function selectExercises(blueprint: TestBlueprint, attempts: LearningAttempt[]): string[] {
  const encountered = new Set(attempts.map((attempt) => attempt.exerciseId));
  const ordered = [...blueprint.exerciseIds].sort((left, right) => {
    const novelty = Number(encountered.has(left)) - Number(encountered.has(right));
    return novelty || left.localeCompare(right);
  });
  return ordered.slice(0, blueprint.selection.maximumItems);
}

function mayAssignOfficialTest(
  blueprint: TestBlueprint,
  projection: LearningProjection,
  contentCatalog: ContentCatalog
): boolean {
  const dimensions = [
    ...contentCatalog.concepts.map((concept) => projection.conceptMastery[concept.id]),
    ...contentCatalog.languageFeatures.map((feature) => projection.languageMastery[feature.id])
  ];
  return dimensions.length > 0 && dimensions.every((estimate) =>
    estimate !== undefined && (estimate.level === "developing" || estimate.level === "consolidating")
  ) && blueprint.officialReferenceId !== undefined;
}

/**
 * Seleziona in modo deterministico il prossimo test. Le verifiche esterne
 * diventano proponibili solo dopo che le evidenze editoriali sono sufficienti.
 */
export function selectNextTest({
  contentCatalog,
  testCatalog,
  projection,
  attempts,
  completedTestIds = []
}: SelectNextTestInput): SelectedTest | undefined {
  const completed = new Set(completedTestIds);
  const didactic = testCatalog.blueprints
    .filter((blueprint) => blueprint.mode === "didactic" && !completed.has(blueprint.id))
    .filter((blueprint) => !blueprint.selection.requiresNovelVariant || hasNovelExercise(blueprint, attempts))
    .filter((blueprint) => blueprint.exerciseIds.every((id) => contentCatalog.exercises.some((exercise) => exercise.id === id)))
    .map((blueprint) => ({ blueprint, score: blueprintScore(blueprint, projection) }))
    .sort((left, right) => right.score - left.score || left.blueprint.id.localeCompare(right.blueprint.id));

  const nextDidactic = didactic[0];
  if (nextDidactic) {
    return {
      blueprint: nextDidactic.blueprint,
      exerciseIds: selectExercises(nextDidactic.blueprint, attempts),
      reason: nextDidactic.score >= 8
        ? "Consolida prima le regole o le frasi che richiedono più supporto."
        : "È il prossimo test redazionale utile per raccogliere nuove evidenze."
    };
  }

  const official = testCatalog.blueprints.find((blueprint) =>
    blueprint.mode === "official-external" &&
    !completed.has(blueprint.id) &&
    mayAssignOfficialTest(blueprint, projection, contentCatalog)
  );
  if (!official) return undefined;
  return {
    blueprint: official,
    exerciseIds: [],
    reason: "Hai raccolto evidenze sufficienti nei test redazionali: puoi passare alla verifica sul sito ministeriale."
  };
}
