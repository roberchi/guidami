import { describe, expect, it } from "vitest";
import {
  advanceAssessmentSession,
  assessmentQuestionById,
  buildLearningProfile,
  createAssessmentSession,
  pauseAssessmentSession,
  recordAssessmentAnswer,
  recordAssessmentHelp,
  recordAssessmentListen,
  resumeAssessmentSession
} from "./assessment";
import type { AssessmentSession } from "./types";

const start = "2026-10-18T10:00:00.000Z";

function answerUntil(
  initial: AssessmentSession,
  targetQuestionId: string
): AssessmentSession {
  let session = initial;
  while (session.currentQuestionId !== targetQuestionId) {
    const question = assessmentQuestionById[session.currentQuestionId];
    session = recordAssessmentAnswer(session, question.correctOptionId ?? "unknown", start);
    session = advanceAssessmentSession(session, start);
  }
  return session;
}

function completeWith(
  initial: AssessmentSession,
  answer: (questionId: string) => string
): AssessmentSession {
  let session = initial;
  while (session.status !== "completed") {
    session = recordAssessmentAnswer(session, answer(session.currentQuestionId), start);
    session = advanceAssessmentSession(session, start);
  }
  return session;
}

describe("sessione di assessment adattivo", () => {
  it("controbilancia l’ordine delle prove con una configurazione versionata", () => {
    const first = createAssessmentSession({ sessionId: "sessione-a", now: start });
    const second = createAssessmentSession({ sessionId: "sessione-b", now: start });

    expect(first.configurationId).toBe("assessment-adattivo-2026-10-v1");
    expect(first.sequenceVariant).not.toBe(second.sequenceVariant);
    expect(new Set(first.questionIds)).toEqual(new Set(second.questionIds));
  });

  it("aggiunge una variante supplementare solo quando deve chiarire una risposta", () => {
    let uncertain = answerUntil(
      createAssessmentSession({ sessionId: "sessione-a", now: start }),
      "crossroad"
    );
    uncertain = recordAssessmentAnswer(uncertain, "unknown", start);
    uncertain = advanceAssessmentSession(uncertain, start);

    expect(uncertain.currentQuestionId).toBe("crossroad-left-check");

    let correct = answerUntil(
      createAssessmentSession({ sessionId: "sessione-a", now: start }),
      "crossroad"
    );
    correct = recordAssessmentAnswer(correct, "orange", start);
    correct = advanceAssessmentSession(correct, start);

    expect(correct.currentQuestionId).not.toBe("crossroad-left-check");
    expect(correct.questionIds).not.toContain("crossroad-left-check");
  });

  it("registra tempo attivo, ascolti, aiuti, cambi e interruzioni senza contare la pausa", () => {
    let session = createAssessmentSession({ sessionId: "metriche", now: start });
    session = recordAssessmentListen(session, "2026-10-18T10:00:05.000Z");
    session = recordAssessmentHelp(session, "2026-10-18T10:00:08.000Z");
    session = recordAssessmentAnswer(session, "audio", "2026-10-18T10:00:10.000Z");
    session = recordAssessmentAnswer(session, "image", "2026-10-18T10:00:12.000Z");
    session = pauseAssessmentSession(session, "2026-10-18T10:00:15.000Z");
    session = resumeAssessmentSession(session, "2026-10-18T10:10:00.000Z");

    const observation = session.observations[session.currentQuestionId];
    expect(observation.elapsedMs).toBe(15_000);
    expect(observation.listenCount).toBe(1);
    expect(observation.helpCount).toBe(1);
    expect(observation.answerChangeCount).toBe(1);
    expect(session.interruptionCount).toBe(1);
    expect(session.currentQuestionId).toBe("reading-comfort");
  });
});

describe("profilo iniziale prudente", () => {
  it("non trasforma una singola risposta in una conclusione stabile", () => {
    let session = answerUntil(
      createAssessmentSession({ sessionId: "evidenza-scarsa", now: start }),
      "crossroad"
    );
    session = recordAssessmentAnswer(session, "orange", start);
    session = {
      ...session,
      status: "completed",
      completedAt: start,
      observations: { crossroad: session.observations.crossroad }
    };

    const profile = buildLearningProfile(session);
    expect(profile.confidence).toBe("da verificare");
    expect(profile.assessmentSummary?.knowledge.outcome).toBe("unobserved");
    expect(profile.strengths).not.toContain("Riconosci regole stradali in più situazioni diverse");
  });

  it("mantiene separate le evidenze sulle regole e quelle sul linguaggio", () => {
    const session = completeWith(
      createAssessmentSession({ sessionId: "profilo-separato", now: start }),
      (questionId) => {
        const question = assessmentQuestionById[questionId];
        if (question.section === "self-report") return "unknown";
        if (question.languageFeatureIds.length > 0) {
          return question.options.find((option) => option.value !== question.correctOptionId && option.value !== "unknown")!.value;
        }
        return question.correctOptionId ?? "unknown";
      }
    );

    const profile = buildLearningProfile(session);
    expect(profile.assessmentSummary?.knowledge.outcome).toBe("strength");
    expect(profile.assessmentSummary?.language.outcome).toBe("needs-support");
    expect(profile.focusAreas).toContain("Distinguere negazioni, possibilità e obblighi");
    expect(profile.assessmentSummary?.missingEvidence).toContain(
      "Formulazioni ministeriali originali non disponibili nel catalogo autorizzato"
    );
  });
});
