import Dexie, { type EntityTable } from "dexie";
import type { LearningEvent } from "../../domain/models";

export interface KeyValueRecord {
  key: string;
  value: unknown;
  updatedAt: string;
}

export class GuidamiDatabase extends Dexie {
  records!: EntityTable<KeyValueRecord, "key">;
  events!: EntityTable<LearningEvent, "id">;

  constructor() {
    super("guidami-learning");
    this.version(1).stores({
      records: "&key, updatedAt",
      events: "&id, deviceId, studentProfileId, type, occurredAt"
    });
  }
}

export const db = new GuidamiDatabase();
