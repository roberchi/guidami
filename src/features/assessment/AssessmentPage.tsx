import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assessmentQuestions } from "../../domain/assessment/assessment";
import { CrossroadIllustration } from "../../components/illustrations/CrossroadIllustration";
import { AppButton } from "../../components/ui/AppButton";
import { ListenButton } from "../../components/ui/ListenButton";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { finishAssessment, saveAssessmentDraft } from "../../state/learningSlice";
import styles from "../../styles/App.module.scss";

function QuestionVisual({ kind }: { kind?: string }) {
  if (kind === "crossroad") return <CrossroadIllustration compact />;
  if (!kind) return null;
  const content = {
    reading: { icon: BookOpen, words: ["prima", "una frase", "poi", "la regola"] },
    language: { icon: MessageCircleMore, words: ["non", "può", "deve", "sempre"] },
    time: { icon: Clock3, words: ["5 min", "10 min", "20 min"] }
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

export function AssessmentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const savedAnswers = useAppSelector((state) => state.learning.snapshot.assessmentAnswers);
  const status = useAppSelector((state) => state.learning.status);
  const [index, setIndex] = useState(() => {
    const firstMissing = assessmentQuestions.findIndex((item) => !savedAnswers[item.id]);
    return firstMissing > 0 ? firstMissing : 0;
  });
  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers);
  const question = assessmentQuestions[index];
  const selected = answers[question.id];
  const percentage = ((index + 1) / assessmentQuestions.length) * 100;
  const spokenText = `${question.prompt}. ${question.description}. ${question.options.map((option) => option.label).join(". ")}`;

  const answeredCount = useMemo(
    () => assessmentQuestions.filter((item) => answers[item.id] && answers[item.id] !== "skipped").length,
    [answers]
  );

  async function continueFlow() {
    if (index < assessmentQuestions.length - 1) {
      setIndex((current) => current + 1);
      return;
    }
    await dispatch(finishAssessment(answers)).unwrap();
    navigate("/profilo");
  }

  async function skip() {
    const nextAnswers = { ...answers, [question.id]: "skipped" };
    setAnswers(nextAnswers);
    await dispatch(saveAssessmentDraft(nextAnswers)).unwrap();
    if (index < assessmentQuestions.length - 1) setIndex((current) => current + 1);
    else {
      await dispatch(finishAssessment(nextAnswers)).unwrap();
      navigate("/profilo");
    }
  }

  return (
    <section className={styles.assessmentPage}>
      <div className={styles.assessmentTopbar}>
        <button type="button" onClick={() => index === 0 ? navigate("/inizia") : setIndex((current) => current - 1)}>
          <ArrowLeft size={18} /> Indietro
        </button>
        <span>Domanda {index + 1} di {assessmentQuestions.length}</span>
        <button type="button" onClick={() => { void dispatch(saveAssessmentDraft(answers)); navigate("/"); }}>Salva e interrompi</button>
      </div>
      <div className={styles.assessmentProgress} aria-label={`${Math.round(percentage)}% completato`}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <div className={styles.assessmentCard} key={question.id}>
        <div className={styles.assessmentQuestion}>
          <span className={styles.flowKicker}>{question.eyebrow.toUpperCase()}</span>
          <h1>{question.prompt}</h1>
          <p>{question.description}</p>
          <ListenButton text={spokenText} />
          <QuestionVisual kind={question.illustration} />
          <div className={styles.optionList} role="radiogroup" aria-label={question.prompt}>
            {question.options.map((option, optionIndex) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected === option.value}
                className={selected === option.value ? styles.optionSelected : ""}
                onClick={() => {
                  const nextAnswers = { ...answers, [question.id]: option.value };
                  setAnswers(nextAnswers);
                  void dispatch(saveAssessmentDraft(nextAnswers));
                }}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + optionIndex)}</span>
                <span><strong>{option.label}</strong>{option.detail ? <small>{option.detail}</small> : null}</span>
                <span className={styles.radioDot} />
              </button>
            ))}
          </div>
          <div className={styles.assessmentActions}>
            <button type="button" className={styles.skipButton} onClick={() => void skip()}>Non so / salta</button>
            <AppButton
              disabled={!selected || status === "saving"}
              icon={<ArrowRight size={19} />}
              onClick={() => void continueFlow()}
            >
              {index === assessmentQuestions.length - 1 ? "Vedi il tuo punto di partenza" : "Continua"}
            </AppButton>
          </div>
          <p className={styles.answerCounter} aria-live="polite">{answeredCount} risposte raccolte · Non assegniamo voti</p>
        </div>
      </div>
    </section>
  );
}
