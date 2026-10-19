import type { CatalogValidationIssue, ContentCatalog } from "./types";

function duplicates(values: string[]): string[] {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

export function validateCatalog(catalog: ContentCatalog): CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];
  const topicIds = new Set(catalog.topics.map((topic) => topic.id));
  const conceptIds = new Set(catalog.concepts.map((concept) => concept.id));
  const languageIds = new Set(catalog.languageFeatures.map((feature) => feature.id));
  const exerciseIds = new Set(catalog.exercises.map((exercise) => exercise.id));
  const lessonIds = new Set(catalog.lessons.map((lesson) => lesson.id));
  const allIds = [
    ...catalog.topics.map((item) => item.id),
    ...catalog.concepts.map((item) => item.id),
    ...catalog.languageFeatures.map((item) => item.id),
    ...catalog.exercises.map((item) => item.id),
    ...catalog.lessons.map((item) => item.id),
    ...catalog.activities.map((item) => item.id)
  ];

  for (const id of duplicates(allIds)) {
    issues.push({ path: id, message: "Identificativo duplicato nel catalogo", severity: "error" });
  }

  for (const concept of catalog.concepts) {
    if (!topicIds.has(concept.topicId)) {
      issues.push({ path: `concepts.${concept.id}.topicId`, message: "Argomento inesistente", severity: "error" });
    }
    for (const prerequisiteId of concept.prerequisiteIds) {
      if (!conceptIds.has(prerequisiteId)) {
        issues.push({ path: `concepts.${concept.id}.prerequisiteIds`, message: "Prerequisito inesistente", severity: "error" });
      }
    }
  }

  for (const exercise of catalog.exercises) {
    for (const topicId of exercise.topicIds) {
      if (!topicIds.has(topicId)) issues.push({ path: `exercises.${exercise.id}.topicIds`, message: "Argomento inesistente", severity: "error" });
    }
    for (const conceptId of [...exercise.conceptIds, ...exercise.prerequisiteConceptIds]) {
      if (!conceptIds.has(conceptId)) issues.push({ path: `exercises.${exercise.id}.conceptIds`, message: "Concetto inesistente", severity: "error" });
    }
    for (const featureId of exercise.languageFeatureIds) {
      if (!languageIds.has(featureId)) issues.push({ path: `exercises.${exercise.id}.languageFeatureIds`, message: "Caratteristica linguistica inesistente", severity: "error" });
    }
    if (!exercise.options.some((option) => option.id === exercise.correctOptionId)) {
      issues.push({ path: `exercises.${exercise.id}.correctOptionId`, message: "Soluzione non presente tra le opzioni", severity: "error" });
    }
    if (exercise.kind === "official-question") {
      if (exercise.origin !== "official" || !exercise.source) {
        issues.push({ path: `exercises.${exercise.id}.source`, message: "Una domanda ufficiale richiede provenienza e fonte", severity: "error" });
      } else if (exercise.source.licenseStatus !== "verified") {
        issues.push({ path: `exercises.${exercise.id}.source.licenseStatus`, message: "Licenza della domanda ufficiale non verificata", severity: "error" });
      }
    }
    if (exercise.origin === "editorial" && exercise.kind === "official-question") {
      issues.push({ path: `exercises.${exercise.id}.origin`, message: "Un esercizio editoriale non può essere dichiarato ufficiale", severity: "error" });
    }
  }

  for (const lesson of catalog.lessons) {
    if (!topicIds.has(lesson.topicId)) {
      issues.push({ path: `lessons.${lesson.id}.topicId`, message: "Argomento inesistente", severity: "error" });
    }
    if (lesson.guidedSteps.length === 0) {
      issues.push({ path: `lessons.${lesson.id}.guidedSteps`, message: "La microlezione richiede almeno un passaggio guidato", severity: "error" });
    }
  }

  for (const activity of catalog.activities) {
    if (!Number.isInteger(activity.planOrder) || activity.planOrder < 1) {
      issues.push({ path: `activities.${activity.id}.planOrder`, message: "Ordine del piano non valido", severity: "error" });
    }
    if (!Number.isInteger(activity.suggestedDayOffset) || activity.suggestedDayOffset < 0) {
      issues.push({ path: `activities.${activity.id}.suggestedDayOffset`, message: "Giorno suggerito non valido", severity: "error" });
    }
    if (!lessonIds.has(activity.lessonId)) {
      issues.push({ path: `activities.${activity.id}.lessonId`, message: "Microlezione inesistente", severity: "error" });
    }
    if (!exerciseIds.has(activity.exerciseId)) {
      issues.push({ path: `activities.${activity.id}.exerciseId`, message: "Esercizio inesistente", severity: "error" });
    }
    for (const conceptId of [...activity.conceptIds, ...activity.prerequisiteConceptIds]) {
      if (!conceptIds.has(conceptId)) issues.push({ path: `activities.${activity.id}.conceptIds`, message: "Concetto inesistente", severity: "error" });
    }
    for (const featureId of activity.languageFeatureIds) {
      if (!languageIds.has(featureId)) issues.push({ path: `activities.${activity.id}.languageFeatureIds`, message: "Caratteristica linguistica inesistente", severity: "error" });
    }
  }

  for (const order of duplicates(catalog.activities.map((activity) => String(activity.planOrder)))) {
    issues.push({ path: `activities.planOrder.${order}`, message: "Ordine del piano duplicato", severity: "error" });
  }
  for (const completionId of duplicates(catalog.activities.map((activity) => activity.completionId))) {
    issues.push({ path: `activities.completionId.${completionId}`, message: "Completamento duplicato", severity: "error" });
  }

  return issues;
}
