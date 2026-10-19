import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, Lightbulb, MessageCircleMore, RotateCcw, TriangleAlert, Volume2 } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CrossroadIllustration } from "../../components/illustrations/CrossroadIllustration";
import { AppButton } from "../../components/ui/AppButton";
import { ListenButton } from "../../components/ui/ListenButton";
import { contentCatalog } from "../../content/catalog/catalog";
import type { LessonVisual } from "../../content/catalog/types";
import { buildIndicativePlan } from "../../domain/learning/buildIndicativePlan";
import { resolveGuidedActivity } from "../../domain/learning/guidedLesson";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { saveLessonCheckpoint, submitActivityAnswer } from "../../state/learningSlice";
import styles from "../../styles/App.module.scss";
import { LanguageSupport } from "./LanguageSupport";

const lessonSteps = ["Obiettivo", "La regola", "Caso guidato", "Prova tu"];

function Visual({ kind }: { kind?: LessonVisual }) {
  if (kind === "crossroad-right") return <CrossroadIllustration />;
  if (kind === "crossroad-left") return <CrossroadIllustration otherVehicleSide="left" />;
  if (kind === "danger-sign") {
    return (
      <div className={styles.dangerSignVisual} role="img" aria-label="Segnale triangolare di pericolo con bordo rosso">
        <div><TriangleAlert aria-hidden="true" /></div>
        <strong>Forma triangolare</strong>
        <span>Bordo rosso: attenzione e prudenza</span>
      </div>
    );
  }
  return (
    <div className={styles.languageLessonVisual} role="img" aria-label="Confronto tra possibilità e obbligo">
      <MessageCircleMore aria-hidden="true" />
      <div><strong>PUÒ</strong><span>possibilità o permesso</span></div>
      <div><strong>DEVE</strong><span>obbligo</span></div>
    </div>
  );
}

function withEmphasis(text: string, emphasis?: string): ReactNode {
  if (!emphasis) return text;
  const start = text.toLocaleLowerCase("it-IT").indexOf(emphasis.toLocaleLowerCase("it-IT"));
  if (start < 0) return text;
  return <>{text.slice(0, start)}<mark>{text.slice(start, start + emphasis.length)}</mark>{text.slice(start + emphasis.length)}</>;
}

export function LessonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { profile, progress } = useAppSelector((state) => state.learning.snapshot);
  const saveStatus = useAppSelector((state) => state.learning.status);
  const saveError = useAppSelector((state) => state.learning.error);
  const route = `${location.pathname}${location.search}`;
  const activity = useMemo(
    () => contentCatalog.activities.find((candidate) => candidate.route === route),
    [route]
  );
  const resolved = useMemo(
    () => activity ? resolveGuidedActivity(contentCatalog, activity.id) : undefined,
    [activity]
  );
  const [generatedAt] = useState(() => new Date().toISOString());
  const indicativePlan = useMemo(() => buildIndicativePlan({
    catalog: contentCatalog,
    completedActivityIds: progress.completedLessons,
    startAt: profile?.assessmentCompletedAt ?? profile?.createdAt ?? generatedAt,
    now: generatedAt
  }), [generatedAt, profile?.assessmentCompletedAt, profile?.createdAt, progress.completedLessons]);
  const planItem = resolved
    ? indicativePlan.items.find((item) => item.activityId === resolved.activity.id)
    : undefined;
  const canStart = planItem?.status === "available" || planItem?.status === "completed";
  const initialStep = resolved && progress.currentActivityId === resolved.activity.id
    ? Math.min(progress.lessonStep, lessonSteps.length - 1)
    : 0;
  const [step, setStep] = useState(initialStep);
  const [answer, setAnswer] = useState<string>();
  const [checked, setChecked] = useState(false);
  const [usedHelp, setUsedHelp] = useState(false);

  useEffect(() => {
    if (canStart && resolved) {
      void dispatch(saveLessonCheckpoint({ activityId: resolved.activity.id, step }));
    }
  }, [canStart, dispatch, resolved, step]);

  if (!resolved || !canStart) return <Navigate to="/oggi" replace />;

  const { activity: currentActivity, lesson, exercise } = resolved;
  const correct = answer === exercise.correctOptionId;

  function next() {
    if (step < lessonSteps.length - 1) setStep((current) => current + 1);
  }

  async function checkAnswer() {
    if (!answer) return;
    try {
      await dispatch(submitActivityAnswer({
        activityId: currentActivity.id,
        exerciseId: exercise.id,
        selectedOptionId: answer,
        usedHelp
      })).unwrap();
      setChecked(true);
    } catch {
      // Il messaggio localizzato viene esposto dallo stato Redux nella pagina.
    }
  }

  return (
    <section className={styles.lessonPage}>
      <div className={styles.lessonTopbar}>
        <button type="button" onClick={() => step === 0 ? navigate("/oggi") : setStep((current) => current - 1)}><ArrowLeft /> Esci</button>
        <div className={styles.lessonTrail}>
          {lessonSteps.map((label, index) => (
            <span key={label} className={index <= step ? styles.trailActive : ""}>
              <i>{index < step ? <Check size={13} /> : index + 1}</i><b>{label}</b>
            </span>
          ))}
        </div>
        <span>{step + 1} / {lessonSteps.length}</span>
      </div>

      <div className={styles.lessonBody}>
        {step === 0 ? (
          <div className={styles.lessonIntro}>
            <span className={styles.flowKicker}>{currentActivity.type === "review" ? "RIPASSO GUIDATO" : "MICROLEZIONE"} · {lesson.title.toUpperCase()}</span>
            <h1>{lesson.headline}</h1>
            <p>{lesson.introduction}</p>
            <div className={styles.lessonObjective}>
              <Lightbulb />
              <div><strong>L’obiettivo di oggi</strong><span>{lesson.objective}</span></div>
            </div>
            <div className={styles.lessonSupports}>
              <span><Eye /> Supporto visivo</span><span><Volume2 /> Audio locale</span><span>~ {currentActivity.estimatedMinutes} min</span>
            </div>
            <AppButton icon={<ArrowRight />} onClick={next}>Inizia la spiegazione</AppButton>
          </div>
        ) : null}

        {step === 1 ? (
          <div className={styles.lessonSplit}>
            <Visual kind={lesson.visual} />
            <div className={styles.lessonCopy}>
              <span className={styles.flowKicker}>LA REGOLA</span>
              <h1>{lesson.ruleTitle}</h1>
              <p>{lesson.ruleExplanation}</p>
              <ListenButton text={lesson.ruleExplanation} onListen={() => setUsedHelp(true)} />
              <div className={styles.ruleCard}><span>In parole semplici</span><strong>{lesson.simpleExplanation}</strong></div>
              <p className={styles.helpTrackingNote}>L’ascolto e gli aiuti vengono registrati come supporti, senza penalità.</p>
              <AppButton icon={<ArrowRight />} onClick={next}>Vediamolo insieme</AppButton>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className={styles.guidedCase}>
            <div>
              <span className={styles.flowKicker}>CASO GUIDATO</span>
              <h1>{lesson.guidedTitle}</h1>
              <p>{lesson.guidedDescription}</p>
            </div>
            <Visual kind={lesson.visual} />
            <div className={styles.reasoningSteps}>
              {lesson.guidedSteps.map((guidedStep, index) => (
                <div key={guidedStep.title}>
                  <span>{index + 1}</span>
                  <p><strong>{guidedStep.title}</strong>{withEmphasis(guidedStep.explanation, guidedStep.emphasis)}</p>
                </div>
              ))}
            </div>
            <div className={styles.guidedAnswer}><Check /><span><strong>{lesson.guidedOutcome}</strong><small>{lesson.guidedOutcomeDetail}</small></span></div>
            <AppButton icon={<ArrowRight />} onClick={next}>Ora provo io</AppButton>
          </div>
        ) : null}

        {step === 3 ? (
          <div className={styles.practiceCard}>
            <div className={styles.practiceCopy}>
              <span className={styles.flowKicker}>PROVA TU · ESERCIZIO DIDATTICO REDAZIONALE</span>
              <h1>{exercise.prompt}</h1>
              <p>Rispondi senza aiuti oppure apri un supporto quando ti serve.</p>
              <ListenButton text={exercise.prompt} onListen={() => setUsedHelp(true)} />
            </div>
            <div className={styles.reverseCrossroad}>
              <Visual kind={exercise.visual} />
            </div>

            <LanguageSupport exercise={exercise} onUseHelp={() => setUsedHelp(true)} />

            <div className={styles.practiceOptions} role="radiogroup" aria-label={exercise.prompt}>
              {exercise.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={answer === option.id}
                  onClick={() => { setAnswer(option.id); setChecked(false); }}
                  className={answer === option.id ? styles.optionSelected : ""}
                >
                  {option.text}<span />
                </button>
              ))}
            </div>

            {checked ? (
              <div className={correct ? styles.correctFeedback : styles.retryFeedback} role="status">
                {correct ? <Check /> : <RotateCcw />}
                <span>
                  <strong>{correct ? exercise.feedback.correct : "Riprova con calma."}</strong>
                  <small>{correct ? (usedHelp ? "Risposta corretta con supporto: la verificheremo più avanti senza aiuti." : "Risposta autonoma su un caso nuovo.") : exercise.feedback.incorrect}</small>
                </span>
              </div>
            ) : null}

            {checked && correct ? (
              <div className={styles.officialTextBridge} role="note">
                <strong>Passaggio al testo d’esame</strong>
                <p>{lesson.officialTextIntroduction}</p>
              </div>
            ) : null}

            {saveError ? <p className={styles.lessonSaveError} role="alert">{saveError}</p> : null}

            <div className={styles.practiceActions}>
              {!checked || !correct ? (
                <AppButton disabled={!answer || saveStatus === "saving"} onClick={() => void checkAnswer()}>
                  {saveStatus === "saving" ? "Salvataggio…" : "Controlla la risposta"}
                </AppButton>
              ) : (
                <AppButton icon={<ArrowRight />} onClick={() => navigate("/oggi")}>Concludi e torna al piano</AppButton>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
