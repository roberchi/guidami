export type AssessmentSection = "self-report" | "practice";
export type AssessmentModality =
  | "self-report"
  | "visual"
  | "oral"
  | "simple-text"
  | "linguistic"
  | "official-wording";
export type AssessmentIllustration =
  | "reading"
  | "crossroad-right"
  | "crossroad-left"
  | "language"
  | "time"
  | "audio"
  | "danger";
export type AssessmentConfidence = "insufficient" | "initial" | "moderate";
export type AssessmentOutcome = "strength" | "needs-support" | "unobserved";
export type AssessmentSupport = "audio" | "visual" | "simplified-text";

export interface AssessmentOption {
  value: string;
  label: string;
  detail?: string;
}

export interface AssessmentQuestion {
  id: string;
  section: AssessmentSection;
  modality: AssessmentModality;
  difficulty: 1 | 2 | 3;
  eyebrow: string;
  prompt: string;
  spokenPrompt?: string;
  description: string;
  options: AssessmentOption[];
  canSkip?: boolean;
  illustration?: AssessmentIllustration;
  helpText?: string;
  correctOptionId?: string;
  conceptIds: string[];
  languageFeatureIds: string[];
  followUpQuestionId?: string;
}

export interface AssessmentObservation {
  questionId: string;
  openedAt: string;
  lastInteractionAt: string;
  selectedValue?: string;
  answeredAt?: string;
  elapsedMs: number;
  listenCount: number;
  helpCount: number;
  answerChangeCount: number;
  skipped: boolean;
}

export interface AssessmentSession {
  schemaVersion: 1;
  id: string;
  configurationId: string;
  sequenceVariant: "A" | "B";
  questionIds: string[];
  currentQuestionId: string;
  observations: Record<string, AssessmentObservation>;
  status: "in-progress" | "paused" | "completed";
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  interruptionCount: number;
}

export interface AssessmentDimensionSummary {
  confidence: AssessmentConfidence;
  outcome: AssessmentOutcome;
  observationCount: number;
  independentCorrectCount: number;
  assistedCorrectCount: number;
  incorrectCount: number;
  skippedCount: number;
}

export interface AssessmentSupportSummary {
  support: AssessmentSupport;
  confidence: AssessmentConfidence;
  outcome: "useful" | "uncertain" | "unobserved";
  observationCount: number;
}

export interface AssessmentSummary {
  configurationId: string;
  completedAt: string;
  knowledge: AssessmentDimensionSummary;
  language: AssessmentDimensionSummary;
  supports: Record<AssessmentSupport, AssessmentSupportSummary>;
  missingEvidence: string[];
  recommendedActivityId: string;
  recommendationReason: string;
}
