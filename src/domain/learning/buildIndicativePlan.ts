import type { ContentCatalog, LearningActivityDefinition } from "../../content/catalog/types";
import type { IndicativePlan, IndicativePlanItem } from "./types";

interface IndicativePlanInput {
  catalog: ContentCatalog;
  completedActivityIds: string[];
  startAt: string;
  now: string;
}

function addDays(value: string, days: number): string {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function startOfUtcDay(value: string): number {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function toPlanItem(
  activity: LearningActivityDefinition,
  status: IndicativePlanItem["status"],
  startAt: string,
  now: string
): IndicativePlanItem {
  const plannedFor = addDays(startAt, activity.suggestedDayOffset);
  return {
    activityId: activity.id,
    completionId: activity.completionId,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    route: activity.route,
    estimatedMinutes: activity.estimatedMinutes,
    reason: status === "completed"
      ? "Attività completata: puoi rivederla quando vuoi."
      : status === "available"
        ? "È il prossimo passo del tuo percorso."
        : "Si sblocca dopo le attività precedenti.",
    priority: activity.planOrder,
    plannedFor,
    status,
    startsEarly: status === "available" && startOfUtcDay(plannedFor) > startOfUtcDay(now)
  };
}

export function buildIndicativePlan({
  catalog,
  completedActivityIds,
  startAt,
  now
}: IndicativePlanInput): IndicativePlan {
  const completed = new Set(completedActivityIds);
  const activities = catalog.activities
    .filter((activity) => activity.available)
    .sort((left, right) => left.planOrder - right.planOrder);
  const firstIncompleteIndex = activities.findIndex(
    (activity) => !completed.has(activity.completionId)
  );

  return {
    generatedAt: now,
    items: activities.map((activity, index) => {
      const status = completed.has(activity.completionId)
        ? "completed"
        : index === firstIncompleteIndex
          ? "available"
          : "locked";
      return toPlanItem(activity, status, startAt, now);
    })
  };
}
