import { ArrowRight, CheckCircle2, CircleHelp, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import { contentCatalog } from "../../content/catalog/catalog";
import type { AssessmentDimensionSummary, AssessmentSupportSummary } from "../../domain/assessment/types";
import { useAppSelector } from "../../state/hooks";
import styles from "../../styles/App.module.scss";

const levelLabels = {
  starting: "Partiamo dalle basi",
  building: "Costruiamo sulle tue basi",
  consolidating: "Consolidiamo ciò che sai"
};

const confidenceLabels = {
  insufficient: "da verificare",
  initial: "iniziale",
  moderate: "moderata"
};

function dimensionText(summary: AssessmentDimensionSummary): string {
  if (summary.outcome === "strength") return "Prime evidenze coerenti";
  if (summary.outcome === "needs-support") return "Da allenare con gradualità";
  return "Servono altre osservazioni";
}

function supportText(summary: AssessmentSupportSummary): string {
  if (summary.outcome === "useful") return "Utile nel contesto osservato";
  if (summary.outcome === "uncertain") return "Utilità ancora da confermare";
  return "Non ancora osservato";
}

export function ProfilePage() {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.learning.snapshot.profile)!;
  const summary = profile.assessmentSummary;
  const recommendedActivity = contentCatalog.activities.find(
    (activity) => activity.id === summary?.recommendedActivityId && activity.available
  ) ?? contentCatalog.activities.find((activity) => activity.id === "lezione-precedenze-base")!;

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

        {summary ? (
          <div className={styles.assessmentEvidence} aria-label="Sintesi delle osservazioni iniziali">
            <div>
              <span>Conoscenze</span>
              <strong>{dimensionText(summary.knowledge)}</strong>
              <small>Affidabilità {confidenceLabels[summary.knowledge.confidence]} · {summary.knowledge.observationCount} osservazioni</small>
            </div>
            <div>
              <span>Linguaggio</span>
              <strong>{dimensionText(summary.language)}</strong>
              <small>Affidabilità {confidenceLabels[summary.language.confidence]} · {summary.language.observationCount} osservazioni</small>
            </div>
            <div>
              <span>Supporti</span>
              <strong>Immagini: {supportText(summary.supports.visual).toLocaleLowerCase("it")}</strong>
              <small>
                Audio: {supportText(summary.supports.audio).toLocaleLowerCase("it")} · Testo semplice: {supportText(summary.supports["simplified-text"]).toLocaleLowerCase("it")}
              </small>
            </div>
          </div>
        ) : null}

        {summary?.missingEvidence.length ? (
          <p className={styles.missingEvidence}>
            <CircleHelp size={17} /> Da verificare più avanti: {summary.missingEvidence.join("; ").toLocaleLowerCase("it")}.
          </p>
        ) : null}

        <div className={styles.firstActivity}>
          <div className={styles.activityNumber}>01</div>
          <div>
            <span>PRIMA ATTIVITÀ · {recommendedActivity.estimatedMinutes} MIN</span>
            <strong>{recommendedActivity.title}</strong>
            <small>{summary?.recommendationReason ?? recommendedActivity.description}</small>
          </div>
          <AppButton icon={<ArrowRight size={18} />} onClick={() => navigate(recommendedActivity.route)}>Inizia</AppButton>
        </div>

        <button type="button" className={styles.textButton} onClick={() => navigate("/oggi")}>Prima guarda il piano di oggi</button>
      </div>
    </section>
  );
}
