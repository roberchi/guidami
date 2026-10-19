import type {
  ContentCatalog,
  ExerciseDefinition,
  GuidedLessonDefinition,
  LearningActivityDefinition
} from "../../content/catalog/types";
import type { LearningActivityAnswer, LearningAttempt } from "./types";

export interface ResolvedGuidedActivity {
  activity: LearningActivityDefinition;
  lesson: GuidedLessonDefinition;
  exercise: ExerciseDefinition;
}

interface BuildLearningAttemptInput {
  id: string;
  occurredAt: string;
  answer: LearningActivityAnswer;
  resolved: ResolvedGuidedActivity;
  previousAttempts: LearningAttempt[];
}

export function resolveGuidedActivity(
  catalog: ContentCatalog,
  activityId: string
): ResolvedGuidedActivity | undefined {
  const activity = catalog.activities.find((candidate) => candidate.id === activityId);
  if (!activity || !activity.available) return undefined;
  const lesson = catalog.lessons.find((candidate) => candidate.id === activity.lessonId);
  const exercise = catalog.exercises.find((candidate) => candidate.id === activity.exerciseId);
  if (!lesson || !exercise) return undefined;
  return { activity, lesson, exercise };
}

export function isGuidedActivityAccessible(
  catalog: ContentCatalog,
  activityId: string,
  completedActivityIds: string[]
): boolean {
  const completed = new Set(completedActivityIds);
  const ordered = catalog.activities
    .filter((activity) => activity.available)
    .sort((left, right) => left.planOrder - right.planOrder);
  const target = ordered.find((activity) => activity.id === activityId);
  if (!target) return false;
  if (completed.has(target.completionId)) return true;
  const firstIncomplete = ordered.find((activity) => !completed.has(activity.completionId));
  return firstIncomplete?.id === target.id;
}

export function buildLearningAttempt({
  id,
  occurredAt,
  answer,
  resolved,
  previousAttempts
}: BuildLearningAttemptInput): LearningAttempt {
  if (answer.activityId !== resolved.activity.id || answer.exerciseId !== resolved.exercise.id) {
    throw new Error("L’attività e l’esercizio non corrispondono");
  }
  if (!resolved.exercise.options.some((option) => option.id === answer.selectedOptionId)) {
    throw new Error("La risposta selezionata non è valida");
  }

  return {
    id,
    activityId: resolved.activity.id,
    exerciseId: resolved.exercise.id,
    occurredAt,
    conceptIds: resolved.exercise.conceptIds,
    languageFeatureIds: resolved.exercise.languageFeatureIds,
    correct: answer.selectedOptionId === resolved.exercise.correctOptionId,
    independent: !answer.usedHelp,
    usedHelp: answer.usedHelp,
    novelVariant: !previousAttempts.some((attempt) => attempt.exerciseId === resolved.exercise.id)
  };
}
