import type { ContentCatalog, LearningActivityDefinition } from "../../content/catalog/types";
import type { DailyPlan, LearningProjection, PlannedActivity } from "./types";

interface PlanInput {
  catalog: ContentCatalog;
  projection: LearningProjection;
  now: string;
  maxActivities?: number;
}

function toPlanned(
  activity: LearningActivityDefinition,
  reason: string,
  priority: number
): PlannedActivity {
  return {
    activityId: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    route: activity.route,
    estimatedMinutes: activity.estimatedMinutes,
    reason,
    priority
  };
}

function prerequisitesReady(activity: LearningActivityDefinition, projection: LearningProjection): boolean {
  return activity.prerequisiteConceptIds.every((id) => {
    const level = projection.conceptMastery[id]?.level;
    return level === "emerging" || level === "developing" || level === "consolidating";
  });
}

export function buildDailyPlan({
  catalog,
  projection,
  now,
  maxActivities = 3
}: PlanInput): DailyPlan {
  const candidates: PlannedActivity[] = [];
  const available = catalog.activities.filter((activity) => activity.available);
  const nowTime = new Date(now).getTime();

  for (const review of projection.reviews) {
    if (new Date(review.dueAt).getTime() > nowTime) continue;
    const activity = available.find((candidate) =>
      candidate.type === "review" &&
      (review.dimension === "concept"
        ? candidate.conceptIds.includes(review.key)
        : candidate.languageFeatureIds.includes(review.key))
    );
    if (activity) candidates.push(toPlanned(activity, "È il momento giusto per consolidare ciò che hai studiato.", 100));
  }

  const weakConcepts = Object.values(projection.conceptMastery)
    .filter((estimate) => estimate.level === "needs-support")
    .map((estimate) => estimate.key);
  for (const conceptId of weakConcepts) {
    const activity = available.find((candidate) => candidate.type === "lesson" && candidate.conceptIds.includes(conceptId));
    if (activity) candidates.push(toPlanned(activity, "Questa regola fondamentale richiede un altro esempio.", 90));
  }

  const weakLanguage = Object.values(projection.languageMastery)
    .filter((estimate) => estimate.level === "needs-support" || estimate.level === "emerging")
    .map((estimate) => estimate.key);
  for (const featureId of weakLanguage) {
    const activity = available.find((candidate) => candidate.type === "language" && candidate.languageFeatureIds.includes(featureId));
    if (activity) candidates.push(toPlanned(activity, "Questa struttura linguistica ricorre nei tuoi tentativi.", 80));
  }

  const newLesson = available.find((activity) =>
    activity.type === "lesson" &&
    activity.conceptIds.some((id) => projection.conceptMastery[id]?.level === "unobserved") &&
    prerequisitesReady(activity, projection)
  );
  if (newLesson) candidates.push(toPlanned(newLesson, "È il prossimo concetto del tuo percorso.", 70));

  const fallback = available.find((activity) => activity.type === "lesson" && prerequisitesReady(activity, projection));
  if (fallback) candidates.push(toPlanned(fallback, "Puoi rafforzare la regola con un nuovo passaggio guidato.", 40));

  const activities = [...new Map(
    candidates
      .sort((left, right) => right.priority - left.priority)
      .map((activity) => [activity.activityId, activity])
  ).values()].slice(0, maxActivities);

  return {
    generatedAt: now,
    activities,
    estimatedMinutes: activities.reduce((total, activity) => total + activity.estimatedMinutes, 0),
    summary: activities.length === 0
      ? "Non ci sono attività disponibili in questo pacchetto di contenuti."
      : activities.length === 1
        ? "Oggi basta una sola attività breve."
        : `Oggi sono previste ${activities.length} attività brevi.`
  };
}
