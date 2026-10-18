import type { LearningProfile } from "../models";

export interface AssessmentOption {
  value: string;
  label: string;
  detail?: string;
}

export interface AssessmentQuestion {
  id: string;
  eyebrow: string;
  prompt: string;
  description: string;
  options: AssessmentOption[];
  canSkip?: boolean;
  illustration?: "reading" | "crossroad" | "language" | "time";
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "reading-comfort",
    eyebrow: "Come studi",
    prompt: "Quando leggi una frase lunga, cosa ti aiuta di più?",
    description: "Non c’è una risposta giusta. Ci serve per preparare le spiegazioni.",
    canSkip: true,
    illustration: "reading",
    options: [
      { value: "simple", label: "Dividerla in parti", detail: "Una frase breve alla volta" },
      { value: "audio", label: "Ascoltarla", detail: "Con una voce lenta e chiara" },
      { value: "image", label: "Vedere un’immagine", detail: "Una situazione concreta" },
      { value: "none", label: "La leggo senza aiuti", detail: "Di solito mi basta il testo" }
    ]
  },
  {
    id: "study-rhythm",
    eyebrow: "Il tuo ritmo",
    prompt: "Quanto tempo preferisci studiare in una volta?",
    description: "Potrai cambiare questa scelta in ogni momento.",
    canSkip: true,
    illustration: "time",
    options: [
      { value: "5", label: "5 minuti", detail: "Una sola attività" },
      { value: "10", label: "10–15 minuti", detail: "Una lezione e un ripasso" },
      { value: "20", label: "20 minuti o più", detail: "Una sessione completa" },
      { value: "unknown", label: "Non lo so ancora" }
    ]
  },
  {
    id: "confidence",
    eyebrow: "Punto di partenza",
    prompt: "Quanto conosci già le regole della strada?",
    description: "È solo una prima impressione, non una valutazione.",
    canSkip: true,
    options: [
      { value: "new", label: "Parto da zero" },
      { value: "some", label: "Conosco alcune regole" },
      { value: "many", label: "Ho già studiato molto" },
      { value: "unknown", label: "Non saprei" }
    ]
  },
  {
    id: "crossroad",
    eyebrow: "Situazione pratica",
    prompt: "All’incrocio non ci sono segnali. Chi passa per primo?",
    description: "Immagina di essere nell’auto verde. L’auto arancione arriva dalla tua destra.",
    illustration: "crossroad",
    options: [
      { value: "orange", label: "L’auto arancione" },
      { value: "green", label: "La mia auto verde" },
      { value: "together", label: "Passano insieme" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "negation",
    eyebrow: "Parole dei quiz",
    prompt: "“Non è vietato svoltare a destra.” Che cosa significa?",
    description: "Scegli la frase che mantiene lo stesso significato.",
    illustration: "language",
    options: [
      { value: "allowed", label: "Si può svoltare a destra" },
      { value: "forbidden", label: "È vietato svoltare a destra" },
      { value: "always", label: "Si deve sempre svoltare a destra" },
      { value: "unknown", label: "Non lo so" }
    ]
  },
  {
    id: "must-may",
    eyebrow: "Parole dei quiz",
    prompt: "Se una regola dice “può”, indica un obbligo?",
    description: "Fai attenzione alla differenza tra possibilità e obbligo.",
    illustration: "language",
    options: [
      { value: "no", label: "No, indica una possibilità" },
      { value: "yes", label: "Sì, indica un obbligo" },
      { value: "same", label: "“Può” e “deve” sono uguali" },
      { value: "unknown", label: "Non lo so" }
    ]
  }
];

const correctPracticalAnswers: Record<string, string> = {
  crossroad: "orange",
  negation: "allowed",
  "must-may": "no"
};

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `profile-${Date.now()}`;
}

export function buildLearningProfile(
  answers: Record<string, string>,
  existingId?: string
): LearningProfile {
  const practicalIds = Object.keys(correctPracticalAnswers);
  const correct = practicalIds.filter((id) => answers[id] === correctPracticalAnswers[id]);
  const answeredPractical = practicalIds.filter(
    (id) => answers[id] && answers[id] !== "unknown" && answers[id] !== "skipped"
  );
  const languageCorrect = ["negation", "must-may"].filter(
    (id) => answers[id] === correctPracticalAnswers[id]
  ).length;
  const strengths: string[] = [];
  const focusAreas: string[] = [];

  if (answers.crossroad === "orange") strengths.push("Riconosci una precedenza in una situazione concreta");
  if (languageCorrect === 2) strengths.push("Distingui bene alcune parole chiave dei quiz");
  if (answers.confidence === "many") strengths.push("Hai già una base di studio su cui costruire");
  if (strengths.length === 0) strengths.push("Hai iniziato a osservare come impari meglio");

  if (answers.negation !== "allowed") focusAreas.push("Frasi con negazioni come “non è vietato”");
  if (answers["must-may"] !== "no") focusAreas.push("Differenza tra “può” e “deve”");
  if (answers.crossroad !== "orange") focusAreas.push("Regole di precedenza agli incroci");
  if (focusAreas.length === 0) focusAreas.push("Consolidare le regole con esempi nuovi");

  const level = correct.length >= 3 ? "consolidating" : correct.length >= 1 ? "building" : "starting";
  const confidence = answeredPractical.length < 2 ? "da verificare" : answeredPractical.length === 3 ? "buona" : "iniziale";
  const now = new Date().toISOString();

  return {
    id: existingId ?? createId(),
    createdAt: now,
    assessmentCompletedAt: now,
    level,
    confidence,
    strengths,
    focusAreas
  };
}
