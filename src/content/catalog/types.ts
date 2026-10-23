export type ContentOrigin = "editorial" | "official";
export type ContentReviewStatus = "draft" | "reviewed" | "published" | "quarantined";
export type ExerciseKind = "concept-check" | "language-training" | "official-question";
export type DifficultyLevel = 1 | 2 | 3;
export type TestMode = "didactic" | "official-external";

export interface ContentSource {
  publisher: string;
  url: string;
  acquiredAt: string;
  sourceVersion: string;
  checksum: string;
  licenseStatus: "verified" | "pending" | "restricted";
}

/**
 * Riferimento a una prova pubblicata dal Ministero. Il listato non viene
 * incluso nell'app finché non esiste un'autorizzazione di riuso verificata.
 */
export interface OfficialTestReference {
  id: string;
  category: "AM" | "AB" | "superiori" | "CQC";
  title: string;
  publicUrl: string;
  retrievedAt: string;
  sourceVersion: string;
  licenseStatus: "pending" | "verified" | "restricted";
  accessMode: "external-link-only" | "embedded-authorized";
  examFormat: {
    questionCount: number;
    durationMinutes: number;
    maximumErrorsToPass: number;
  };
}

/** Un insieme intenzionale di esercizi redazionali da assegnare dal motore. */
export interface TestBlueprint {
  id: string;
  title: string;
  description: string;
  mode: TestMode;
  targetLevel: DifficultyLevel;
  topicIds: string[];
  conceptIds: string[];
  languageFeatureIds: string[];
  exerciseIds: string[];
  selection: {
    minimumItems: number;
    maximumItems: number;
    requiresNovelVariant: boolean;
  };
  officialReferenceId?: string;
}

export interface TopicDefinition {
  id: string;
  label: string;
  description: string;
  order: number;
}

export interface ConceptDefinition {
  id: string;
  topicId: string;
  label: string;
  description: string;
  prerequisiteIds: string[];
  fundamental: boolean;
}

export interface LanguageFeatureDefinition {
  id: string;
  label: string;
  description: string;
  examples: string[];
}

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface GlossaryEntry {
  term: string;
  explanation: string;
}

export type LessonVisual = "crossroad-right" | "crossroad-left" | "danger-sign" | "language";

export interface GuidedLessonStep {
  title: string;
  explanation: string;
  emphasis?: string;
}

export interface GuidedLessonDefinition {
  id: string;
  topicId: string;
  title: string;
  headline: string;
  introduction: string;
  objective: string;
  ruleTitle: string;
  ruleExplanation: string;
  simpleExplanation: string;
  visual: LessonVisual;
  guidedTitle: string;
  guidedDescription: string;
  guidedSteps: GuidedLessonStep[];
  guidedOutcome: string;
  guidedOutcomeDetail: string;
  officialTextIntroduction: string;
}

export interface ExerciseDefinition {
  id: string;
  version: number;
  kind: ExerciseKind;
  origin: ContentOrigin;
  reviewStatus: ContentReviewStatus;
  topicIds: string[];
  conceptIds: string[];
  languageFeatureIds: string[];
  prerequisiteConceptIds: string[];
  difficulty: DifficultyLevel;
  transferGroupId: string;
  visual?: LessonVisual;
  prompt: string;
  simplifiedPrompt?: string;
  segments?: string[];
  glossary?: GlossaryEntry[];
  options: ExerciseOption[];
  correctOptionId: string;
  feedback: {
    correct: string;
    incorrect: string;
    uncertain: string;
  };
  source?: ContentSource;
}

export interface LearningActivityDefinition {
  id: string;
  completionId: string;
  lessonId: string;
  exerciseId: string;
  type: "lesson" | "review" | "language" | "quiz" | "simulation";
  title: string;
  description: string;
  route: string;
  estimatedMinutes: number;
  planOrder: number;
  suggestedDayOffset: number;
  conceptIds: string[];
  languageFeatureIds: string[];
  prerequisiteConceptIds: string[];
  available: boolean;
}

export interface ContentCatalog {
  releaseId: string;
  schemaVersion: number;
  publishedAt: string;
  topics: TopicDefinition[];
  concepts: ConceptDefinition[];
  languageFeatures: LanguageFeatureDefinition[];
  exercises: ExerciseDefinition[];
  lessons: GuidedLessonDefinition[];
  activities: LearningActivityDefinition[];
}

export interface TestCatalog {
  releaseId: string;
  schemaVersion: number;
  publishedAt: string;
  officialReferences: OfficialTestReference[];
  blueprints: TestBlueprint[];
}

export interface CatalogValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}
