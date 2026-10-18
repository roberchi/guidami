import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, Lightbulb, RotateCcw, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CrossroadIllustration } from "../../components/illustrations/CrossroadIllustration";
import { AppButton } from "../../components/ui/AppButton";
import { ListenButton } from "../../components/ui/ListenButton";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { finishLesson, saveLessonCheckpoint } from "../../state/learningSlice";
import styles from "../../styles/App.module.scss";

const lessonSteps = ["Obiettivo", "La regola", "Caso guidato", "Prova tu"];

export function LessonPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const savedStep = useAppSelector((state) => state.learning.snapshot.progress.lessonStep);
  const [step, setStep] = useState(Math.min(savedStep, lessonSteps.length - 1));
  const [answer, setAnswer] = useState<string>();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    void dispatch(saveLessonCheckpoint(step));
  }, [dispatch, step]);

  function next() {
    if (step < lessonSteps.length - 1) setStep((current) => current + 1);
  }

  async function complete() {
    await dispatch(finishLesson("precedenze-base")).unwrap();
    navigate("/oggi");
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
            <span className={styles.flowKicker}>MICROLEZIONE · PRECEDENZE</span>
            <h1>Chi passa per primo<br /><em>a un incrocio?</em></h1>
            <p>Alla fine saprai riconoscere chi ha la precedenza quando non ci sono semafori né segnali.</p>
            <div className={styles.lessonObjective}>
              <Lightbulb />
              <div><strong>L’obiettivo di oggi</strong><span>Guardare da dove arrivano i veicoli e applicare la regola della destra.</span></div>
            </div>
            <div className={styles.lessonSupports}>
              <span><Eye /> Illustrazione</span><span><Volume2 /> Audio disponibile</span><span>~ 7 min</span>
            </div>
            <AppButton icon={<ArrowRight />} onClick={next}>Inizia la spiegazione</AppButton>
          </div>
        ) : null}

        {step === 1 ? (
          <div className={styles.lessonSplit}>
            <CrossroadIllustration />
            <div className={styles.lessonCopy}>
              <span className={styles.flowKicker}>LA REGOLA</span>
              <h1>Guarda alla tua <em>destra.</em></h1>
              <p>Quando a un incrocio non ci sono segnali, devi dare la precedenza al veicolo che arriva dalla tua destra.</p>
              <ListenButton text="Quando a un incrocio non ci sono segnali, devi dare la precedenza al veicolo che arriva dalla tua destra." />
              <div className={styles.ruleCard}><span>In parole semplici</span><strong>Se qualcuno arriva da destra, lo lasci passare prima.</strong></div>
              <div className={styles.wordNote}><strong>“Dare la precedenza”</strong><span>significa rallentare o fermarsi per lasciare passare un altro veicolo.</span></div>
              <AppButton icon={<ArrowRight />} onClick={next}>Vediamolo insieme</AppButton>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className={styles.guidedCase}>
            <div>
              <span className={styles.flowKicker}>CASO GUIDATO</span>
              <h1>Sei nell’auto verde.</h1>
              <p>L’auto arancione arriva dalla tua destra. Seguiamo due passaggi.</p>
            </div>
            <CrossroadIllustration />
            <div className={styles.reasoningSteps}>
              <div><span>1</span><p><strong>Da dove arriva l’altra auto?</strong> Arriva dalla tua <mark>destra</mark>.</p></div>
              <div><span>2</span><p><strong>Quale regola usiamo?</strong> Chi arriva da destra passa <mark>per primo</mark>.</p></div>
            </div>
            <div className={styles.guidedAnswer}><Check /><span><strong>Quindi passa prima l’auto arancione.</strong><small>Tu rallenti e le dai la precedenza.</small></span></div>
            <AppButton icon={<ArrowRight />} onClick={next}>Ora provo io</AppButton>
          </div>
        ) : null}

        {step === 3 ? (
          <div className={styles.practiceCard}>
            <div className={styles.practiceCopy}>
              <span className={styles.flowKicker}>PROVA TU · CASO NUOVO</span>
              <h1>Ora l’auto blu arriva dalla tua sinistra. Chi passa prima?</h1>
              <p>Non ci sono segnali. Tu sei sempre nell’auto verde.</p>
              <ListenButton text="Ora l’auto blu arriva dalla tua sinistra. Non ci sono segnali. Tu sei nell’auto verde. Chi passa prima?" />
            </div>
            <div className={styles.reverseCrossroad}>
              <CrossroadIllustration />
              <span>Immagina l’auto arancione sul lato opposto: ora arriva da sinistra.</span>
            </div>
            <div className={styles.practiceOptions} role="radiogroup" aria-label="Chi passa per primo?">
              <button type="button" role="radio" aria-checked={answer === "green"} onClick={() => { setAnswer("green"); setChecked(false); }} className={answer === "green" ? styles.optionSelected : ""}>La mia auto verde<span /></button>
              <button type="button" role="radio" aria-checked={answer === "blue"} onClick={() => { setAnswer("blue"); setChecked(false); }} className={answer === "blue" ? styles.optionSelected : ""}>L’auto che arriva da sinistra<span /></button>
            </div>

            {checked ? (
              <div className={answer === "green" ? styles.correctFeedback : styles.retryFeedback} role="status">
                {answer === "green" ? <Check /> : <RotateCcw />}
                <span>
                  <strong>{answer === "green" ? "Esatto: passi prima tu." : "Riguardiamo la direzione."}</strong>
                  <small>{answer === "green" ? "Non arriva nessuno dalla tua destra, quindi puoi proseguire con prudenza." : "L’altro veicolo è alla tua sinistra: non ha la precedenza su di te in questo caso."}</small>
                </span>
              </div>
            ) : null}

            <div className={styles.practiceActions}>
              {!checked || answer !== "green" ? (
                <AppButton disabled={!answer} onClick={() => setChecked(true)}>Controlla la risposta</AppButton>
              ) : (
                <AppButton icon={<ArrowRight />} onClick={() => void complete()}>Completa la lezione</AppButton>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
