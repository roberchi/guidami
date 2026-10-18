import type { LearningEvent, StorageMode, SyncState } from "../../domain/models";

export type { LearningEvent, StorageMode, SyncState };

export interface CloudIdentity {
  provider: Exclude<StorageMode, "local">;
  accountId: string;
  displayName?: string;
}

export interface EventBatch {
  batchId: string;
  schemaVersion: number;
  studentProfileId: string;
  events: LearningEvent[];
  checksum: string;
}

export interface RemoteBatchInfo {
  id: string;
  name: string;
  size: number;
  checksum?: string;
}

export interface CloudStorageProvider {
  readonly type: Exclude<StorageMode, "local">;
  connect(): Promise<CloudIdentity>;
  disconnect(): Promise<void>;
  listBatches(): Promise<RemoteBatchInfo[]>;
  downloadBatch(id: string): Promise<EventBatch>;
  uploadBatch(batch: EventBatch): Promise<void>;
  deleteRemoteData(): Promise<void>;
}
