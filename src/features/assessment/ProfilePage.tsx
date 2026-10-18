import { ArrowRight, CheckCircle2, CircleHelp, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import { useAppSelector } from "../../state/hooks";
import styles from "../../styles/App.module.scss";

const levelLabels = {
  starting: "Partiamo dalle basi",
  building: "Costruiamo sulle tue basi",
  consolidating: "Consolidiamo ciò che sai"
};

export function ProfilePage() {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.learning.snapshot.profile)!;

  return (
    <section className={styles.resultPage}>
      <div className={styles.resultConfetti} aria-hidden="true"><span>✦</span><span>●</span><span>✦</span><span>●</span></div>
      <div className={styles.resultCard}>
        <div className={styles.resultIcon}><Sparkles /></div>
        <span className={styles.flowKicker}>IL TUO PUNTO DI PARTENZA</span>
        <h1>{levelLabels[profile.level]}</h1>
        <p className={styles.resultIntro}>Queste sono prime osservazioni, non un voto né una diagnosi. Le aggiorneremo con calma mentre studi.</p>

        <div className={styles.resultColumns}>
          <div>
            <div className={styles.resultTitle}><CheckCircle2 /><span><strong>Cose che già funzionano</strong><small>Osservate nelle tue risposte</small></span></div>
            <ul>{profile.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul>
          </div>
          <div>
            <div className={styles.resultTitle}><Target /><span><strong>Da allenare insieme</strong><small>Il tuo primo obiettivo</small></span></div>
            <ul>{profile.focusAreas.map((focus) => <li key={focus}>{focus}</li>)}</ul>
          </div>
        </div>

        <div className={styles.confidenceNote}>
          <CircleHelp size={21} />
          <span><strong>Affidabilità della stima: {profile.confidence}</strong><small>Una singola risposta non definisce mai il tuo percorso.</small></span>
        </div>

        <div className={styles.firstActivity}>
          <div className={styles.activityNumber}>01</div>
          <div><span>PRIMA ATTIVITÀ · 7 MIN</span><strong>Le precedenze: capire chi passa per primo</strong><small>Spiegazione visiva + un caso nuovo</small></div>
          <AppButton icon={<ArrowRight size={18} />} onClick={() => navigate("/lezione/precedenze")}>Inizia</AppButton>
        </div>

        <button type="button" className={styles.textButton} onClick={() => navigate("/oggi")}>Prima guarda il piano di oggi</button>
      </div>
    </section>
  );
}
