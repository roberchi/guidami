import type { LearningEvent } from "../../domain/models";

export class EventCollisionError extends Error {
  constructor(eventId: string) {
    super(`Collisione incoerente per l'evento ${eventId}`);
    this.name = "EventCollisionError";
  }
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => `${JSON.stringify(key)}:${canonical(child)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function mergeEvents(...collections: LearningEvent[][]): LearningEvent[] {
  const byId = new Map<string, LearningEvent>();
  for (const event of collections.flat()) {
    const existing = byId.get(event.id);
    if (existing && canonical(existing) !== canonical(event)) throw new EventCollisionError(event.id);
    byId.set(event.id, event);
  }
  return [...byId.values()].sort((left, right) => {
    const timeOrder = left.occurredAt.localeCompare(right.occurredAt);
    return timeOrder === 0 ? left.id.localeCompare(right.id) : timeOrder;
  });
}
