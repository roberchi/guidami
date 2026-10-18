import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Headphones,
  HelpCircle,
  MessageCircleMore,
  TriangleAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  advanceAssessmentSession,
  assessmentConfiguration,
  assessmentQuestionById,
  createAssessmentSession,
  moveToPreviousAssessmentQuestion,
  pauseAssessmentSession,
  recordAssessmentAnswer,
  recordAssessmentHelp,
  recordAssessmentListen,
  resumeAssessmentSession,
  skipAssessmentQuestion
} from "../../domain/assessment/assessment";
import type { AssessmentIllustration, AssessmentSession } from "../../domain/assessment/types";
import { CrossroadIllustration } from "../../components/illustrations/CrossroadIllustration";
import { AppButton } from "../../components/ui/AppButton";
import { ListenButton } from "../../components/ui/ListenButton";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { finishAssessment, saveAssessmentSession } from "../../state/learningSlice";
import styles from "../../styles/App.module.scss";

function QuestionVisual({ kind }: { kind?: AssessmentIllustration }) {
  if (kind === "crossroad-right") return <CrossroadIllustration compact />;
  if (kind === "crossroad-left") return <CrossroadIllustration compact otherVehicleSide="left" />;
  if (!kind) return null;

  const content = {
    reading: { icon: BookOpen, words: ["prima", "una frase", "poi", "la regola"] },
    language: { icon: MessageCircleMore, words: ["non", "può", "deve", "sempre"] },
    time: { icon: Clock3, words: ["5 min", "10 min", "20 min"] },
    audio: { icon: Headphones, words: ["ascolta", "ripeti", "scegli"] },
    danger: { icon: TriangleAlert, words: ["forma", "bordo rosso", "pericolo"] }
  }[kind];
  if (!content) return null;
  const Icon = content.icon;
  return (
    <div className={styles.questionVisual} aria-hidden="true">
      <Icon size={38} />
      <div>{content.words.map((word) => <span key={word}>{word}</span>)}</div>
    </div>
  );
}

function startSession(
  storedSession: AssessmentSession | null,
  legacyAnswers: Record<string, string>
): AssessmentSession {
  const now = new Date().toISOString();
  if (
    storedSession
    && storedSession.status !== "completed"
    && storedSession.configurationId === assessmentConfiguration.id
    && assessmentQuestionById[storedSession.currentQuestionId]
  ) {
    return resumeAssessmentSession(storedSession, now, storedSession.status === "in-progress");
  }
  return createAssessmentSession({ now, legacyAnswers });
}

export function AssessmentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storedSession = useAppSelector((state) => state.learning.snapshot.assessmentSession);
  const legacyAnswers = useAppSelector((state) => state.learning.snapshot.assessmentAnswers);
  const saveStatus = useAppSelector((state) => state.learning.status);
  const saveError = useAppSelector((state) => state.learning.error);
  const [session, setSession] = useState(() => startSession(storedSession, legacyAnswers));
  const [visibleHelpId, setVisibleHelpId] = useState<string>();
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
  const question = assessmentQuestionById[session.currentQuestionId];
  const observation = session.observations[session.currentQuestionId];
  const selected = observation?.selectedValue;
  const currentIndex = session.questionIds.indexOf(session.currentQuestionId);
  const percentage = ((currentIndex + 1) / session.questionIds.length) * 100;
  const spokenText = `${question.spokenPrompt ?? question.prompt}. ${question.description}. ${question.options.map((option) => option.label).join(". ")}`;

  const answeredCount = useMemo(
    () => Object.values(session.observations).filter(
      (item) => item.selectedValue && item.selectedValue !== "skipped" && item.selectedValue !== "unknown"
    ).length,
    [session.observations]
  );

  function enqueueSave(nextSession: AssessmentSession): Promise<unknown> {
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => dispatch(saveAssessmentSession(nextSession)).unwrap());
    return saveQueue.current;
  }

  function updateSession(nextSession: AssessmentSession) {
    setSession(nextSession);
    void enqueueSave(nextSession);
  }

  useEffect(() => {
    void enqueueSave(session);
    // La sessione iniziale viene preparata una sola volta per questa apertura della pagina.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function continueFlow() {
    const nextSession = advanceAssessmentSession(session);
    setVisibleHelpId(undefined);
    setSession(nextSession);
    if (nextSession.status === "completed") {
      await saveQueue.current.catch(() => undefined);
      await dispatch(finishAssessment(nextSession)).unwrap();
      navigate("/profilo");
      return;
    }
    void enqueueSave(nextSession);
  }

  async function skip() {
    const skippedSession = skipAssessmentQuestion(session);
    const nextSession = advanceAssessmentSession(skippedSession);
    setVisibleHelpId(undefined);
    setSession(nextSession);
    if (nextSession.status === "completed") {
      await saveQueue.current.catch(() => undefined);
      await dispatch(finishAssessment(nextSession)).unwrap();
      navigate("/profilo");
      return;
    }
    void enqueueSave(nextSession);
  }

  async function pauseAndLeave(path: string) {
    const paused = pauseAssessmentSession(session);
    setSession(paused);
    await enqueueSave(paused).catch(() => undefined);
    navigate(path);
  }

  function goBack() {
    if (currentIndex === 0) {
      void pauseAndLeave("/inizia");
      return;
    }
    setVisibleHelpId(undefined);
    updateSession(moveToPreviousAssessmentQuestion(session));
  }

  function toggleHelp() {
    if (visibleHelpId === question.id) {
      setVisibleHelpId(undefined);
      return;
    }
    setVisibleHelpId(question.id);
    updateSession(recordAssessmentHelp(session));
  }

  return (
    <section className={styles.assessmentPage}>
      <div className={styles.assessmentTopbar}>
        <button type="button" onClick={goBack}>
          <ArrowLeft size={18} /> Indietro
        </button>
        <span>Passaggio {currentIndex + 1} di {session.questionIds.length}</span>
        <button type="button" onClick={() => void pauseAndLeave("/")}>Salva e interrompi</button>
      </div>
      <div className={styles.assessmentProgress} aria-label={`${Math.round(percentage)}% del percorso completato`}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <div className={styles.assessmentCard} key={question.id}>
        <div className={styles.assessmentQuestion}>
          <span className={styles.assessmentSectionBadge}>
            {question.section === "self-report" ? "Autovalutazione" : "Prova pratica"}
          </span>
          <span className={styles.flowKicker}>{question.eyebrow.toUpperCase()}</span>
          <h1>{question.prompt}</h1>
          <p>{question.description}</p>
          <ListenButton
            text={spokenText}
            label={question.modality === "oral" ? "Ascolta la situazione" : "Ascolta"}
            onListen={() => updateSession(recordAssessmentListen(session))}
          />
          <QuestionVisual kind={question.illustration} />
          {question.helpText ? (
            <div className={styles.assessmentHelp}>
              <button type="button" aria-expanded={visibleHelpId === question.id} onClick={toggleHelp}>
                <HelpCircle size={17} /> {visibleHelpId === question.id ? "Nascondi l’aiuto" : "Mostra un aiuto"}
              </button>
              {visibleHelpId === question.id ? <p role="note">{question.helpText}</p> : null}
            </div>
          ) : null}
          <div className={styles.optionList} role="radiogroup" aria-label={question.prompt}>
            {question.options.map((option, optionIndex) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected === option.value}
                className={selected === option.value ? styles.optionSelected : ""}
                onClick={() => updateSession(recordAssessmentAnswer(session, option.value))}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + optionIndex)}</span>
                <span><strong>{option.label}</strong>{option.detail ? <small>{option.detail}</small> : null}</span>
                <span className={styles.radioDot} />
              </button>
            ))}
          </div>
          {saveError ? <p className={styles.assessmentSaveError} role="alert">{saveError}</p> : null}
          <div className={styles.assessmentActions}>
            <button type="button" className={styles.skipButton} onClick={() => void skip()}>Non so / salta</button>
            <AppButton
              disabled={!selected || saveStatus === "loading"}
              icon={<ArrowRight size={19} />}
              onClick={() => void continueFlow()}
            >
              {currentIndex === session.questionIds.length - 1 ? "Vedi il tuo punto di partenza" : "Continua"}
            </AppButton>
          </div>
          <p className={styles.answerCounter} aria-live="polite">
            {answeredCount} osservazioni raccolte · Nessun voto
          </p>
        </div>
      </div>
    </section>
  );
}
