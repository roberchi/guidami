import type { LearningProfile } from "../models";
import type {
  AssessmentConfidence,
  AssessmentDimensionSummary,
  AssessmentObservation,
  AssessmentQuestion,
  AssessmentSession,
  AssessmentSummary,
  AssessmentSupport,
  AssessmentSupportSummary
} from "./types";

export const assessmentConfiguration = {
  id: "assessment-adattivo-2026-10-v1",
  version: 1,
  selfReportQuestionIds: [
    "reading-comfort",
    "study-rhythm",
    "confidence",
    "support-preference",
    "quiz-pace"
  ],
  practiceOrders: {
    A: ["crossroad", "danger-audio", "precedence-simple", "negation", "must-may"],
    B: ["precedence-simple", "negation", "danger-audio", "crossroad", "must-may"]
  },
  officialWordingQuestionIds: [] as string[]
} as const;

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "reading-comfort",
    section: "self-report",
    modality: "self-report",
    difficulty: 1,
    eyebrow: "Autovalutazione · Come studi",
    prompt: "Quando leggi una frase lunga, cosa ti aiuta di più?",
    description: "Non c’è una risposta giusta. Ci serve per preparare le spiegazioni.",
    canSkip: true,
    illustration: "reading",
    conceptIds: [],
    languageFeatureIds: [],
    options: [
      { value: "simple", label: "Dividerla in parti", detail: "Una frase breve alla volta" },
      { value: "audio", label: "Ascoltarla", detail: "Con una voce lenta e chiara" },
      { value: "image", label: "Vedere un’immagine", detail: "Una situazione concreta" },
      { value: "none", label: "La leggo senza aiuti", detail: "Di solito mi basta il testo" },
      { value: "unknown", label: "Non lo so ancora" }
    ]
  },
  {
    id: "study-rhythm",
    section: "self-report",
    modality: "self-report",
    difficulty: 1,
    eyebrow: "Autovalutazione · Il tuo ritmo",
    prompt: "Quanto tempo preferisci studiare in una volta?",
    description: "Potrai cambiare questa scelta in ogni momento.",
    canSkip: true,
    illustration: "time",
    conceptIds: [],
    languageFeatureIds: [],
    options: [
      { value: "5", label: "5 minuti", detail: "Una sola attività" },
      { value: "10", label: "10–15 minuti", detail: "Una lezione e un ripasso" },
      { value: "20", label: "20 minuti o più", detail: "Una sessione completa" },
      { value: "unknown", label: "Non lo so ancora" }
    ]
  },
  {
    id: "confidence",
    section: "self-report",
    modality: "self-report",
    difficulty: 1,
    eyebrow: "Autovalutazione · Punto di partenza",
    prompt: "Quanto conosci già le regole della strada?",
    description: "È solo una prima impressione, non una valutazione.",
    canSkip: true,
    conceptIds: [],
    languageFeatureIds: [],
    options: [
      { value: "new", label: "Parto da zero" },
      { value: "some", label: "Conosco alcune regole" },
      { value: "many", label: "Ho già studiato molto" },
      { value: "unknown", label: "Non saprei" }
    ]
  },
  {
    id: "support-preference",
    section: "self-report",
    modality: "self-report",
    difficulty: 1,
    eyebrow: "Autovalutazione · Supporti",
    prompt: "Se una spiegazione non è chiara, cosa provi per prima?",
    description: "Puoi usare più supporti durante lo studio: questa scelta non ti limita.",
    canSkip: true,
    illustration: "reading",
    conceptIds: [],
    languageFeatureIds: [],
    options: [
      { value: "audio", label: "La ascolto" },
      { value: "image", label: "Cerco un’immagine" },
      { value: "simple", label: "Cerco parole più semplici" },
      { value: "retry", label: "La rileggo con calma" },
      { value: "unknown", label: "Non saprei" }
    ]
  },
  {
    id: "quiz-pace",
    section: "self-report",
    modality: "self-report",
    difficulty: 1,
    eyebrow: "Autovalutazione · Tempi",
    prompt: "Come preferisci rispondere quando c’è un limite di tempo?",
    description: "Il tempo orientativo non viene mai usato da solo per valutarti.",
    canSkip: true,
    illustration: "time",
    conceptIds: [],
    languageFeatureIds: [],
    options: [
      { value: "calm", label: "Preferisco andare con calma" },
      { value: "visible", label: "Mi aiuta vedere il tempo rimasto" },
      { value: "hidden", label: "Preferisco non vedere il tempo" },
      { value: "indifferent", label: "Per me non cambia" },
      { value: "unknown", label: "Non saprei" }
    ]
  },
  {
    id: "crossroad",
    section: "practice",
    modality: "visual",
    difficulty: 1,
    eyebrow: "Prova pratica · Situazione visuale",
    prompt: "All’incrocio non ci sono segnali. Chi passa per primo?",
    description: "Tu sei nell’auto verde. L’auto arancione arriva dalla tua destra.",
    illustration: "crossroad-right",
    helpText: "Guarda da quale lato arriva l’altra auto e applica la regola della precedenza a destra.",
    correctOptionId: "orange",
    conceptIds: ["precedenza-destra", "incrocio-senza-segnali"],
    languageFeatureIds: [],
    followUpQuestionId: "crossroad-left-check",
    options: [
      { value: "orange", label: "L’auto arancione" },
      { value: "green", label: "La mia auto verde" },
      { value: "together", label: "Passano insieme" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "danger-audio",
    section: "practice",
    modality: "oral",
    difficulty: 1,
    eyebrow: "Prova pratica · Ascolto",
    prompt: "Ascolta la situazione e scegli la risposta.",
    spokenPrompt: "Vedi un segnale triangolare con il bordo rosso. Che cosa ti comunica in generale?",
    description: "Puoi riascoltare oppure mostrare il testo con il pulsante Aiuto.",
    illustration: "audio",
    helpText: "Testo ascoltato: vedi un segnale triangolare con il bordo rosso. Che cosa ti comunica in generale?",
    correctOptionId: "danger",
    conceptIds: ["segnale-pericolo"],
    languageFeatureIds: [],
    followUpQuestionId: "danger-visual-check",
    options: [
      { value: "danger", label: "Avvisa di un pericolo" },
      { value: "obligation", label: "Indica sempre un obbligo" },
      { value: "parking", label: "Indica un parcheggio" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "precedence-simple",
    section: "practice",
    modality: "simple-text",
    difficulty: 2,
    eyebrow: "Prova pratica · Testo semplice",
    prompt: "Nessuno arriva dalla tua destra. Un’auto arriva da sinistra. Chi può passare per primo?",
    description: "Scegli usando la stessa regola dell’incrocio.",
    helpText: "Controlla prima la tua destra: se è libera, puoi proseguire con prudenza.",
    correctOptionId: "green",
    conceptIds: ["precedenza-destra"],
    languageFeatureIds: [],
    followUpQuestionId: "crossroad-left-check",
    options: [
      { value: "green", label: "La mia auto verde" },
      { value: "left", label: "L’auto che arriva da sinistra" },
      { value: "together", label: "Passano insieme" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "negation",
    section: "practice",
    modality: "linguistic",
    difficulty: 2,
    eyebrow: "Prova pratica · Linguaggio",
    prompt: "“Non è vietato svoltare a destra.” Che cosa significa?",
    description: "Scegli la frase che mantiene lo stesso significato.",
    illustration: "language",
    helpText: "“Non è vietato” significa che quel comportamento è consentito, se le altre condizioni lo permettono.",
    correctOptionId: "allowed",
    conceptIds: [],
    languageFeatureIds: ["negazione"],
    followUpQuestionId: "permission-simple-check",
    options: [
      { value: "allowed", label: "Si può svoltare a destra" },
      { value: "forbidden", label: "È vietato svoltare a destra" },
      { value: "always", label: "Si deve sempre svoltare a destra" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "must-may",
    section: "practice",
    modality: "linguistic",
    difficulty: 2,
    eyebrow: "Prova pratica · Linguaggio",
    prompt: "Se una regola dice “può”, indica un obbligo?",
    description: "Fai attenzione alla differenza tra possibilità e obbligo.",
    illustration: "language",
    helpText: "“Può” indica una possibilità o un permesso. “Deve” indica un obbligo.",
    correctOptionId: "no",
    conceptIds: [],
    languageFeatureIds: ["verbi-modali"],
    followUpQuestionId: "modal-example-check",
    options: [
      { value: "no", label: "No, indica una possibilità" },
      { value: "yes", label: "Sì, indica un obbligo" },
      { value: "same", label: "“Può” e “deve” sono uguali" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "crossroad-left-check",
    section: "practice",
    modality: "visual",
    difficulty: 2,
    eyebrow: "Verifica supplementare · Situazione visuale",
    prompt: "Ora l’auto blu arriva dalla tua sinistra. Chi passa per primo?",
    description: "Tu sei sempre nell’auto verde e non ci sono segnali.",
    illustration: "crossroad-left",
    helpText: "Osserva se arriva qualcuno dalla tua destra prima di scegliere.",
    correctOptionId: "green",
    conceptIds: ["precedenza-destra", "incrocio-senza-segnali"],
    languageFeatureIds: [],
    options: [
      { value: "green", label: "La mia auto verde" },
      { value: "blue", label: "L’auto blu" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "danger-visual-check",
    section: "practice",
    modality: "visual",
    difficulty: 1,
    eyebrow: "Verifica supplementare · Immagine",
    prompt: "Questa forma di segnale serve in generale ad avvisare di un pericolo?",
    description: "La domanda verifica il concetto con un supporto visivo.",
    illustration: "danger",
    helpText: "I segnali triangolari con bordo rosso richiamano l’attenzione su un pericolo.",
    correctOptionId: "yes",
    conceptIds: ["segnale-pericolo"],
    languageFeatureIds: [],
    options: [
      { value: "yes", label: "Sì" },
      { value: "no", label: "No" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "permission-simple-check",
    section: "practice",
    modality: "simple-text",
    difficulty: 1,
    eyebrow: "Verifica supplementare · Concetto",
    prompt: "Se una svolta è consentita, puoi farla quando la strada è libera e sicura?",
    description: "Qui la frase non contiene una negazione.",
    helpText: "“Consentita” significa permessa, non obbligatoria.",
    correctOptionId: "yes",
    conceptIds: ["obbligo-possibilita"],
    languageFeatureIds: [],
    options: [
      { value: "yes", label: "Sì, è permessa" },
      { value: "no", label: "No, è sempre vietata" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "modal-example-check",
    section: "practice",
    modality: "linguistic",
    difficulty: 1,
    eyebrow: "Verifica supplementare · Parole chiave",
    prompt: "Quale frase esprime un obbligo?",
    description: "Confronta “può” e “deve” in un esempio nuovo.",
    helpText: "Cerca la parola che richiede un comportamento.",
    correctOptionId: "must",
    conceptIds: [],
    languageFeatureIds: ["verbi-modali"],
    options: [
      { value: "may", label: "Il conducente può rallentare" },
      { value: "must", label: "Il conducente deve fermarsi" },
      { value: "unknown", label: "Non lo so" }
    ]
  }
];

export const assessmentQuestionById = Object.fromEntries(
  assessmentQuestions.map((question) => [question.id, question])
) as Record<string, AssessmentQuestion>;

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `assessment-${Date.now()}`;
}

function variantFor(sessionId: string): "A" | "B" {
  const sum = Array.from(sessionId).reduce((total, character) => total + character.charCodeAt(0), 0);
  return sum % 2 === 0 ? "A" : "B";
}

function createObservation(questionId: string, now: string): AssessmentObservation {
  return {
    questionId,
    openedAt: now,
    lastInteractionAt: now,
    elapsedMs: 0,
    listenCount: 0,
    helpCount: 0,
    answerChangeCount: 0,
    skipped: false
  };
}

function withElapsedTime(observation: AssessmentObservation, now: string): AssessmentObservation {
  const elapsed = Math.max(0, Date.parse(now) - Date.parse(observation.lastInteractionAt));
  return {
    ...observation,
    elapsedMs: observation.elapsedMs + (Number.isFinite(elapsed) ? elapsed : 0),
    lastInteractionAt: now
  };
}

function legacyObservations(
  questionIds: string[],
  answers: Record<string, string>,
  now: string
): Record<string, AssessmentObservation> {
  return Object.fromEntries(
    questionIds
      .filter((questionId) => answers[questionId])
      .map((questionId) => [questionId, {
        ...createObservation(questionId, now),
        selectedValue: answers[questionId],
        answeredAt: now,
        skipped: answers[questionId] === "skipped"
      }])
  );
}

export function createAssessmentSession(options?: {
  sessionId?: string;
  now?: string;
  legacyAnswers?: Record<string, string>;
}): AssessmentSession {
  const id = options?.sessionId ?? createId();
  const now = options?.now ?? new Date().toISOString();
  const variant = variantFor(id);
  const questionIds = [
    ...assessmentConfiguration.selfReportQuestionIds,
    ...assessmentConfiguration.practiceOrders[variant]
  ];
  const observations = legacyObservations(questionIds, options?.legacyAnswers ?? {}, now);
  const firstMissing = questionIds.find((questionId) => !observations[questionId]?.selectedValue) ?? questionIds[0];
  observations[firstMissing] ??= createObservation(firstMissing, now);

  return {
    schemaVersion: 1,
    id,
    configurationId: assessmentConfiguration.id,
    sequenceVariant: variant,
    questionIds,
    currentQuestionId: firstMissing,
    observations,
    status: "in-progress",
    startedAt: now,
    updatedAt: now,
    interruptionCount: 0
  };
}

function updateCurrentObservation(
  session: AssessmentSession,
  now: string,
  update: (observation: AssessmentObservation) => AssessmentObservation
): AssessmentSession {
  const current = session.observations[session.currentQuestionId]
    ?? createObservation(session.currentQuestionId, now);
  return {
    ...session,
    updatedAt: now,
    observations: {
      ...session.observations,
      [session.currentQuestionId]: update(withElapsedTime(current, now))
    }
  };
}

export function recordAssessmentAnswer(
  session: AssessmentSession,
  value: string,
  now = new Date().toISOString()
): AssessmentSession {
  return updateCurrentObservation(session, now, (observation) => ({
    ...observation,
    selectedValue: value,
    answeredAt: now,
    skipped: false,
    answerChangeCount: observation.selectedValue && observation.selectedValue !== value
      ? observation.answerChangeCount + 1
      : observation.answerChangeCount
  }));
}

export function recordAssessmentListen(
  session: AssessmentSession,
  now = new Date().toISOString()
): AssessmentSession {
  return updateCurrentObservation(session, now, (observation) => ({
    ...observation,
    listenCount: observation.listenCount + 1
  }));
}

export function recordAssessmentHelp(
  session: AssessmentSession,
  now = new Date().toISOString()
): AssessmentSession {
  return updateCurrentObservation(session, now, (observation) => ({
    ...observation,
    helpCount: observation.helpCount + 1
  }));
}

export function skipAssessmentQuestion(
  session: AssessmentSession,
  now = new Date().toISOString()
): AssessmentSession {
  return updateCurrentObservation(session, now, (observation) => ({
    ...observation,
    selectedValue: "skipped",
    answeredAt: now,
    skipped: true
  }));
}

function needsFollowUp(session: AssessmentSession, question: AssessmentQuestion): boolean {
  const observation = session.observations[question.id];
  return Boolean(
    question.followUpQuestionId
    && observation
    && (observation.skipped || observation.selectedValue !== question.correctOptionId)
    && !session.questionIds.includes(question.followUpQuestionId)
  );
}

export function advanceAssessmentSession(
  session: AssessmentSession,
  now = new Date().toISOString()
): AssessmentSession {
  const question = assessmentQuestionById[session.currentQuestionId];
  const currentIndex = session.questionIds.indexOf(session.currentQuestionId);
  const questionIds = [...session.questionIds];

  if (question && needsFollowUp(session, question) && question.followUpQuestionId) {
    questionIds.splice(currentIndex + 1, 0, question.followUpQuestionId);
  }

  const nextQuestionId = questionIds[currentIndex + 1];
  if (!nextQuestionId) {
    return {
      ...session,
      questionIds,
      status: "completed",
      completedAt: now,
      updatedAt: now
    };
  }

  return {
    ...session,
    questionIds,
    currentQuestionId: nextQuestionId,
    observations: {
      ...session.observations,
      [nextQuestionId]: session.observations[nextQuestionId] ?? createObservation(nextQuestionId, now)
    },
    updatedAt: now
  };
}

export function moveToPreviousAssessmentQuestion(
  session: AssessmentSession,
  now = new Date().toISOString()
): AssessmentSession {
  const currentIndex = session.questionIds.indexOf(session.currentQuestionId);
  if (currentIndex <= 0) return session;
  const previousQuestionId = session.questionIds[currentIndex - 1];
  const previous = session.observations[previousQuestionId] ?? createObservation(previousQuestionId, now);
  return {
    ...session,
    currentQuestionId: previousQuestionId,
    observations: {
      ...session.observations,
      [previousQuestionId]: { ...previous, lastInteractionAt: now }
    },
    updatedAt: now
  };
}

export function pauseAssessmentSession(
  session: AssessmentSession,
  now = new Date().toISOString()
): AssessmentSession {
  const timed = updateCurrentObservation(session, now, (observation) => observation);
  return {
    ...timed,
    status: "paused",
    interruptionCount: session.interruptionCount + 1
  };
}

export function resumeAssessmentSession(
  session: AssessmentSession,
  now = new Date().toISOString(),
  unexpectedInterruption = false
): AssessmentSession {
  if (session.status === "completed") return session;
  const current = session.observations[session.currentQuestionId]
    ?? createObservation(session.currentQuestionId, now);
  return {
    ...session,
    status: "in-progress",
    updatedAt: now,
    interruptionCount: session.interruptionCount + (unexpectedInterruption ? 1 : 0),
    observations: {
      ...session.observations,
      [session.currentQuestionId]: { ...current, lastInteractionAt: now }
    }
  };
}

export function assessmentAnswersFromSession(session: AssessmentSession): Record<string, string> {
  return Object.fromEntries(
    Object.values(session.observations)
      .filter((observation) => observation.selectedValue)
      .map((observation) => [observation.questionId, observation.selectedValue as string])
  );
}

function confidenceFor(observationCount: number): AssessmentConfidence {
  if (observationCount < 2) return "insufficient";
  if (observationCount < 3) return "initial";
  return "moderate";
}

function summarizeDimension(
  session: AssessmentSession,
  includes: (question: AssessmentQuestion) => boolean
): AssessmentDimensionSummary {
  const entries = session.questionIds
    .map((questionId) => assessmentQuestionById[questionId])
    .filter((question): question is AssessmentQuestion => Boolean(question) && includes(question))
    .map((question) => ({ question, observation: session.observations[question.id] }))
    .filter(({ observation }) => Boolean(observation?.selectedValue));
  const answered = entries.filter(({ observation }) => !observation.skipped && observation.selectedValue !== "unknown");
  const correct = answered.filter(({ question, observation }) => observation.selectedValue === question.correctOptionId);
  const independentCorrectCount = correct.filter(({ observation }) => observation.helpCount === 0).length;
  const assistedCorrectCount = correct.length - independentCorrectCount;
  const observationCount = answered.length;
  const outcome = observationCount < 2
    ? "unobserved"
    : correct.length / observationCount >= 0.67
      ? "strength"
      : "needs-support";

  return {
    confidence: confidenceFor(observationCount),
    outcome,
    observationCount,
    independentCorrectCount,
    assistedCorrectCount,
    incorrectCount: observationCount - correct.length,
    skippedCount: entries.length - observationCount
  };
}

function summarizeSupport(
  support: AssessmentSupport,
  signals: number,
  useful: boolean
): AssessmentSupportSummary {
  return {
    support,
    confidence: confidenceFor(signals),
    outcome: signals === 0 ? "unobserved" : useful ? "useful" : "uncertain",
    observationCount: signals
  };
}

function selected(session: AssessmentSession, questionId: string): string | undefined {
  return session.observations[questionId]?.selectedValue;
}

function buildAssessmentSummary(session: AssessmentSession): AssessmentSummary {
  const knowledge = summarizeDimension(session, (question) => question.conceptIds.length > 0);
  const language = summarizeDimension(session, (question) => question.languageFeatureIds.length > 0);
  const observations = Object.values(session.observations);
  const audioListens = observations.reduce((total, observation) => total + observation.listenCount, 0);
  const simplifiedHelp = observations.reduce((total, observation) => total + observation.helpCount, 0);
  const audioPreference = [selected(session, "reading-comfort"), selected(session, "support-preference")]
    .filter((value) => value === "audio").length;
  const visualPreference = [selected(session, "reading-comfort"), selected(session, "support-preference")]
    .filter((value) => value === "image").length;
  const simplePreference = [selected(session, "reading-comfort"), selected(session, "support-preference")]
    .filter((value) => value === "simple").length;
  const visualAnswers = session.questionIds.filter((questionId) => {
    const question = assessmentQuestionById[questionId];
    const observation = session.observations[questionId];
    return question?.modality === "visual"
      && Boolean(observation?.selectedValue)
      && !observation?.skipped;
  }).length;
  const visualRecovery = ["crossroad-left-check", "danger-visual-check"].filter((questionId) => {
    const question = assessmentQuestionById[questionId];
    return session.observations[questionId]?.selectedValue === question?.correctOptionId;
  }).length;
  const assistedRecovery = session.questionIds.filter((questionId) => {
    const question = assessmentQuestionById[questionId];
    const observation = session.observations[questionId];
    return observation?.helpCount > 0 && observation.selectedValue === question?.correctOptionId;
  }).length;
  const missingEvidence: string[] = [];

  if (knowledge.confidence === "insufficient") missingEvidence.push("Conoscenze delle regole ancora da verificare");
  if (language.confidence === "insufficient") missingEvidence.push("Comprensione del linguaggio ancora da verificare");
  if (assessmentConfiguration.officialWordingQuestionIds.length === 0) {
    missingEvidence.push("Formulazioni ministeriali originali non disponibili nel catalogo autorizzato");
  }

  const recommendationReason = knowledge.outcome === "needs-support"
    ? "Partiamo da una regola concreta con immagini e un caso nuovo."
    : language.outcome === "needs-support"
      ? "Partiamo da una situazione concreta e colleghiamo con calma regola e parole chiave."
      : "Consolidiamo ciò che hai osservato con una situazione nuova e guidata.";

  return {
    configurationId: session.configurationId,
    completedAt: session.completedAt ?? session.updatedAt,
    knowledge,
    language,
    supports: {
      audio: summarizeSupport(
        "audio",
        audioPreference + audioListens,
        audioPreference > 0 && audioListens > 0
      ),
      visual: summarizeSupport(
        "visual",
        visualPreference + visualAnswers + visualRecovery,
        visualRecovery > 0 || (visualPreference > 0 && visualAnswers > 0)
      ),
      "simplified-text": summarizeSupport(
        "simplified-text",
        simplePreference + simplifiedHelp + assistedRecovery,
        assistedRecovery > 0 || (simplePreference > 0 && simplifiedHelp > 0)
      )
    },
    missingEvidence,
    recommendedActivityId: "lezione-precedenze-base",
    recommendationReason
  };
}

function profileId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `profile-${Date.now()}`;
}

export function buildLearningProfile(
  session: AssessmentSession,
  existingId?: string
): LearningProfile {
  const summary = buildAssessmentSummary(session);
  const { knowledge, language } = summary;
  const strengths: string[] = [];
  const focusAreas: string[] = [];

  if (knowledge.outcome === "strength") strengths.push("Riconosci regole stradali in più situazioni diverse");
  if (language.outcome === "strength") strengths.push("Distingui alcune parole chiave nelle frasi dei quiz");
  if (summary.supports.visual.outcome === "useful") strengths.push("Le immagini sono risultate utili nel contesto osservato");
  if (summary.supports.audio.outcome === "useful") strengths.push("L’ascolto è risultato utile nel contesto osservato");
  if (strengths.length === 0) strengths.push("Hai raccolto le prime osservazioni sul tuo modo di studiare");

  if (knowledge.outcome === "needs-support") focusAreas.push("Applicare le regole in situazioni stradali diverse");
  if (language.outcome === "needs-support") focusAreas.push("Distinguere negazioni, possibilità e obblighi");
  if (knowledge.outcome === "unobserved") focusAreas.push("Conoscenze delle regole da verificare con altri esempi");
  if (language.outcome === "unobserved") focusAreas.push("Comprensione delle frasi da verificare con altre prove");
  if (focusAreas.length === 0) focusAreas.push("Consolidare le osservazioni con varianti nuove");

  const completedAt = session.completedAt ?? session.updatedAt;
  const enoughEvidence = knowledge.observationCount >= 2 && language.observationCount >= 2;
  const correctKnowledge = knowledge.independentCorrectCount + knowledge.assistedCorrectCount;
  const level = enoughEvidence && correctKnowledge >= 3
    ? "consolidating"
    : enoughEvidence && correctKnowledge >= 1
      ? "building"
      : "starting";
  const confidence = !enoughEvidence
    ? "da verificare"
    : knowledge.confidence === "moderate" && language.confidence === "moderate"
      ? "buona"
      : "iniziale";

  return {
    id: existingId ?? profileId(),
    createdAt: completedAt,
    assessmentCompletedAt: completedAt,
    level,
    confidence,
    strengths,
    focusAreas,
    assessmentSummary: summary
  };
}
