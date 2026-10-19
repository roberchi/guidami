import type { AppSnapshot } from "../../domain/models";
import { defaultSnapshot } from "../../domain/models";
import type { AssessmentSession } from "../../domain/assessment/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isSnapshotCandidate(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isRecord(value.preferences) && isRecord(value.progress) && isRecord(value.sync);
}

function isAssessmentSessionCandidate(value: unknown): value is AssessmentSession {
  if (!isRecord(value)) return false;
  return value.schemaVersion === 1
    && typeof value.id === "string"
    && typeof value.configurationId === "string"
    && (value.sequenceVariant === "A" || value.sequenceVariant === "B")
    && Array.isArray(value.questionIds)
    && typeof value.currentQuestionId === "string"
    && isRecord(value.observations)
    && (value.status === "in-progress" || value.status === "paused" || value.status === "completed");
}

export function migrateSnapshot(value: unknown): AppSnapshot {
  if (!isRecord(value)) return structuredClone(defaultSnapshot);
  const preferences = isRecord(value.preferences) ? value.preferences : {};
  const progress = isRecord(value.progress) ? value.progress : {};
  const sync = isRecord(value.sync) ? value.sync : {};
  const learning = isRecord(value.learning) ? value.learning : {};
  const projection = isRecord(learning.projection) ? learning.projection : {};

  return {
    ...structuredClone(defaultSnapshot),
    ...value,
    schemaVersion: 4,
    contentReleaseId: typeof value.contentReleaseId === "string"
      ? value.contentReleaseId
      : defaultSnapshot.contentReleaseId,
    profile: isRecord(value.profile) ? value.profile as unknown as AppSnapshot["profile"] : null,
    assessmentAnswers: isRecord(value.assessmentAnswers)
      ? value.assessmentAnswers as Record<string, string>
      : {},
    assessmentSession: isAssessmentSessionCandidate(value.assessmentSession)
      ? value.assessmentSession
      : null,
    preferences: {
      ...defaultSnapshot.preferences,
      ...preferences
    } as AppSnapshot["preferences"],
    progress: {
      ...defaultSnapshot.progress,
      ...progress,
      completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons as string[] : [],
      currentActivityId: typeof progress.currentActivityId === "string"
        ? progress.currentActivityId
        : typeof progress.lessonStep === "number" && progress.lessonStep > 0
          ? "lezione-precedenze-base"
          : undefined
    } as AppSnapshot["progress"],
    learning: {
      attempts: Array.isArray(learning.attempts)
        ? learning.attempts as AppSnapshot["learning"]["attempts"]
        : [],
      projection: {
        ...structuredClone(defaultSnapshot.learning.projection),
        ...projection,
        conceptMastery: isRecord(projection.conceptMastery) ? projection.conceptMastery : {},
        languageMastery: isRecord(projection.languageMastery) ? projection.languageMastery : {},
        reviews: Array.isArray(projection.reviews) ? projection.reviews : []
      } as AppSnapshot["learning"]["projection"]
    },
    sync: {
      ...defaultSnapshot.sync,
      ...sync,
      pendingBatchIds: Array.isArray(sync.pendingBatchIds) ? sync.pendingBatchIds as string[] : []
    } as AppSnapshot["sync"]
  };
}
