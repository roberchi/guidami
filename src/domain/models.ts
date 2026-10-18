export type TextSize = "standard" | "large" | "extra-large";

export interface Preferences {
  textSize: TextSize;
  highContrast: boolean;
  reducedMotion: boolean;
  speechRate: number;
}

export interface LearningProfile {
  id: string;
  createdAt: string;
  assessmentCompletedAt?: string;
  level: "starting" | "building" | "consolidating";
  confidence: "da verificare" | "iniziale" | "buona";
  strengths: string[];
  focusAreas: string[];
}

export interface LearningProgress {
  completedLessons: string[];
  lessonStep: number;
  streakDays: number;
  lastActivityAt?: string;
}

export type StorageMode = "local" | "google" | "microsoft";
export type SyncStatus = "local" | "synced" | "pending" | "auth-required" | "error";

export interface SyncState {
  mode: StorageMode;
  accountId?: string;
  lastSuccessfulSync?: string;
  pendingBatchIds: string[];
  status: SyncStatus;
}

export interface AppSnapshot {
  profile: LearningProfile | null;
  assessmentAnswers: Record<string, string>;
  preferences: Preferences;
  progress: LearningProgress;
  sync: SyncState;
}

export interface LearningEvent {
  id: string;
  deviceId: string;
  studentProfileId: string;
  type: string;
  occurredAt: string;
  schemaVersion: number;
  payload: unknown;
}

export const defaultSnapshot: AppSnapshot = {
  profile: null,
  assessmentAnswers: {},
  preferences: {
    textSize: "standard",
    highContrast: false,
    reducedMotion: false,
    speechRate: 0.9
  },
  progress: {
    completedLessons: [],
    lessonStep: 0,
    streakDays: 0
  },
  sync: {
    mode: "local",
    pendingBatchIds: [],
    status: "local"
  }
};
