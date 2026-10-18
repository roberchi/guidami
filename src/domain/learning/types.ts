export type MasteryDimension = "concept" | "language";
export type MasteryLevel = "unobserved" | "needs-support" | "emerging" | "developing" | "consolidating";
export type EvidenceConfidence = "insufficient" | "initial" | "moderate" | "strong";

export interface LearningAttempt {
  id: string;
  activityId: string;
  exerciseId: string;
  occurredAt: string;
  conceptIds: string[];
  languageFeatureIds: string[];
  correct: boolean;
  independent: boolean;
  usedHelp: boolean;
  novelVariant: boolean;
  responseTimeMs?: number;
}

export interface MasteryEstimate {
  key: string;
  dimension: MasteryDimension;
  level: MasteryLevel;
  confidence: EvidenceConfidence;
  observationCount: number;
  independentCorrectCount: number;
  assistedCorrectCount: number;
  incorrectCount: number;
  distinctExerciseCount: number;
  delayedConfirmationCount: number;
  lastObservedAt?: string;
}

export interface ReviewSchedule {
  id: string;
  key: string;
  dimension: MasteryDimension;
  intervalIndex: number;
  dueAt: string;
  reason: "first-review" | "consolidation" | "recovery";
  sourceAttemptId: string;
}

export interface LearningProjection {
  projectorVersion: number;
  conceptMastery: Record<string, MasteryEstimate>;
  languageMastery: Record<string, MasteryEstimate>;
  reviews: ReviewSchedule[];
  lastProjectedAt?: string;
}

export interface PlannedActivity {
  activityId: string;
  type: "lesson" | "review" | "language" | "quiz" | "simulation";
  title: string;
  description: string;
  route: string;
  estimatedMinutes: number;
  reason: string;
  priority: number;
}

export interface DailyPlan {
  generatedAt: string;
  activities: PlannedActivity[];
  estimatedMinutes: number;
  summary: string;
}

export const emptyLearningProjection: LearningProjection = {
  projectorVersion: 1,
  conceptMastery: {},
  languageMastery: {},
  reviews: []
};
