import Dexie, { type EntityTable } from "dexie";
import type { LearningAttempt, ReviewSchedule } from "../../domain/learning/types";
import type { LearningEvent } from "../../domain/models";

export interface KeyValueRecord {
  key: string;
  value: unknown;
  updatedAt: string;
}

export class GuidamiDatabase extends Dexie {
  records!: EntityTable<KeyValueRecord, "key">;
  events!: EntityTable<LearningEvent, "id">;
  attempts!: EntityTable<LearningAttempt, "id">;
  reviews!: EntityTable<ReviewSchedule, "id">;

  constructor() {
    super("guidami-learning");
    this.version(1).stores({
      records: "&key, updatedAt",
      events: "&id, deviceId, studentProfileId, type, occurredAt"
    });
    this.version(2).stores({
      records: "&key, updatedAt",
      events: "&id, deviceId, studentProfileId, type, occurredAt",
      attempts: "&id, activityId, exerciseId, occurredAt, *conceptIds, *languageFeatureIds",
      reviews: "&id, dueAt, dimension, key"
    });
  }
}

export const db = new GuidamiDatabase();
