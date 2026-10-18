export type ContentOrigin = "editorial" | "official";
export type ContentReviewStatus = "draft" | "reviewed" | "published" | "quarantined";
export type ExerciseKind = "concept-check" | "language-training" | "official-question";
export type DifficultyLevel = 1 | 2 | 3;

export interface ContentSource {
  publisher: string;
  url: string;
  acquiredAt: string;
  sourceVersion: string;
  checksum: string;
  licenseStatus: "verified" | "pending" | "restricted";
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
  type: "lesson" | "review" | "language" | "quiz" | "simulation";
  title: string;
  description: string;
  route: string;
  estimatedMinutes: number;
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
  activities: LearningActivityDefinition[];
}

export interface CatalogValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}
