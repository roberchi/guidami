import { contentCatalog } from "./catalog";

export function activityRoute(activityId?: string): string | undefined {
  if (!activityId) return undefined;
  return contentCatalog.activities.find((activity) => activity.id === activityId)?.route;
}
