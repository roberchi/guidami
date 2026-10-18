import type {
  EvidenceConfidence,
  LearningAttempt,
  LearningProjection,
  MasteryDimension,
  MasteryEstimate,
  MasteryLevel,
  ReviewSchedule
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14] as const;

function addDays(isoDate: string, days: number): string {
  return new Date(new Date(isoDate).getTime() + days * DAY_MS).toISOString();
}

function estimateConfidence(observations: number, distinctExercises: number): EvidenceConfidence {
  if (observations < 2) return "insufficient";
  if (observations < 4 || distinctExercises < 2) return "initial";
  if (observations < 7 || distinctExercises < 3) return "moderate";
  return "strong";
}

function estimateLevel(attempts: LearningAttempt[]): MasteryLevel {
  if (attempts.length === 0) return "unobserved";
  const independentCorrect = attempts.filter((attempt) => attempt.correct && attempt.independent && !attempt.usedHelp);
  const correct = attempts.filter((attempt) => attempt.correct);
  const distinct = new Set(independentCorrect.map((attempt) => attempt.exerciseId)).size;
  const delayedConfirmations = countDelayedConfirmations(independentCorrect);
  const recent = attempts.slice(-3);
  const recentErrors = recent.filter((attempt) => !attempt.correct).length;

  if (recentErrors >= 2 || correct.length === 0) return "needs-support";
  if (independentCorrect.length >= 3 && distinct >= 2 && delayedConfirmations >= 1) return "consolidating";
  if (independentCorrect.length >= 2 && distinct >= 2) return "developing";
  return "emerging";
}

function countDelayedConfirmations(attempts: LearningAttempt[]): number {
  const sorted = [...attempts].sort((left, right) => left.occurredAt.localeCompare(right.occurredAt));
  let confirmations = 0;
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const distance = new Date(current.occurredAt).getTime() - new Date(previous.occurredAt).getTime();
    if (distance >= DAY_MS && current.exerciseId !== previous.exerciseId) confirmations += 1;
  }
  return confirmations;
}

function attemptsForKey(
  attempts: LearningAttempt[],
  key: string,
  dimension: MasteryDimension
): LearningAttempt[] {
  return attempts
    .filter((attempt) => dimension === "concept" ? attempt.conceptIds.includes(key) : attempt.languageFeatureIds.includes(key))
    .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt));
}

function buildEstimate(
  key: string,
  dimension: MasteryDimension,
  attempts: LearningAttempt[]
): MasteryEstimate {
  const relevant = attemptsForKey(attempts, key, dimension);
  const independentCorrect = relevant.filter((attempt) => attempt.correct && attempt.independent && !attempt.usedHelp);
  const distinctExerciseCount = new Set(relevant.map((attempt) => attempt.exerciseId)).size;
  return {
    key,
    dimension,
    level: estimateLevel(relevant),
    confidence: estimateConfidence(relevant.length, distinctExerciseCount),
    observationCount: relevant.length,
    independentCorrectCount: independentCorrect.length,
    assistedCorrectCount: relevant.filter((attempt) => attempt.correct && (!attempt.independent || attempt.usedHelp)).length,
    incorrectCount: relevant.filter((attempt) => !attempt.correct).length,
    distinctExerciseCount,
    delayedConfirmationCount: countDelayedConfirmations(independentCorrect),
    lastObservedAt: relevant.at(-1)?.occurredAt
  };
}

function nextReviewForKey(
  key: string,
  dimension: MasteryDimension,
  attempts: LearningAttempt[]
): ReviewSchedule | undefined {
  const relevant = attemptsForKey(attempts, key, dimension);
  const latest = relevant.at(-1);
  if (!latest) return undefined;

  let intervalIndex = 0;
  let reason: ReviewSchedule["reason"] = "first-review";
  for (const attempt of relevant) {
    if (!attempt.correct) {
      intervalIndex = 0;
      reason = "recovery";
    } else if (attempt.independent && !attempt.usedHelp && attempt.novelVariant) {
      if (attempt !== relevant[0]) intervalIndex = Math.min(intervalIndex + 1, REVIEW_INTERVAL_DAYS.length - 1);
      reason = intervalIndex === 0 ? "first-review" : "consolidation";
    }
  }

  return {
    id: `${dimension}:${key}`,
    key,
    dimension,
    intervalIndex,
    dueAt: addDays(latest.occurredAt, REVIEW_INTERVAL_DAYS[intervalIndex]),
    reason,
    sourceAttemptId: latest.id
  };
}

export function projectLearning(
  attempts: LearningAttempt[],
  conceptIds: string[],
  languageFeatureIds: string[]
): LearningProjection {
  const conceptMastery = Object.fromEntries(
    conceptIds.map((key) => [key, buildEstimate(key, "concept", attempts)])
  );
  const languageMastery = Object.fromEntries(
    languageFeatureIds.map((key) => [key, buildEstimate(key, "language", attempts)])
  );
  const reviews = [
    ...conceptIds.map((key) => nextReviewForKey(key, "concept", attempts)),
    ...languageFeatureIds.map((key) => nextReviewForKey(key, "language", attempts))
  ].filter((review): review is ReviewSchedule => Boolean(review));

  return {
    projectorVersion: 1,
    conceptMastery,
    languageMastery,
    reviews,
    lastProjectedAt: attempts.length > 0
      ? [...attempts].sort((left, right) => left.occurredAt.localeCompare(right.occurredAt)).at(-1)?.occurredAt
      : undefined
  };
}
