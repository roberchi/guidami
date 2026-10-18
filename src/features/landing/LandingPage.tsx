import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  Check,
  Cloud,
  Eye,
  Headphones,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2
} from "lucide-react";
import { RoadIllustration } from "../../components/illustrations/RoadIllustration";
import { useAppSelector } from "../../state/hooks";
import styles from "../../styles/App.module.scss";

const steps = [
  {
    number: "01",
    icon: Brain,
    title: "Scopri come impari",
    text: "Una breve prova ci aiuta a capire quali spiegazioni possono esserti più utili."
  },
  {
    number: "02",
    icon: Eye,
    title: "Capisci la regola",
    text: "Partiamo da situazioni concrete, immagini e parole semplici."
  },
  {
    number: "03",
    icon: BookOpenCheck,
    title: "Esercitati davvero",
    text: "Applica la regola a casi nuovi, poi affronta il linguaggio dei quiz."
  },
  {
    number: "04",
    icon: RotateCcw,
    title: "Ripassa al momento giusto",
    text: "Il tuo piano riporta in primo piano ciò che va consolidato."
  }
];

const faqs = [
  ["Devo registrarmi?", "No. Puoi iniziare e continuare in modalità locale, senza creare un profilo Guidami."],
  ["Dove sono i miei dati?", "Per impostazione predefinita, progressi e preferenze restano nell’archivio locale del tuo dispositivo."],
  ["Se cambio dispositivo?", "Puoi esportare una copia di sicurezza. In futuro potrai anche collegare Google Drive o OneDrive in modo facoltativo."],
  ["Cosa succede se cancello i dati di navigazione?", "I progressi salvati soltanto sul dispositivo possono andare persi. Ti ricorderemo di esportare una copia di sicurezza."],
  ["L’IA vede le mie risposte?", "No. Valutazioni e percorsi usano regole predefinite e vengono calcolati direttamente sul dispositivo."],
  ["Guidami garantisce il superamento?", "No. Ti aiuta a studiare con metodo, ma non può garantire l’esito dell’esame."]
];

export function LandingPage() {
  const { profile, progress, assessmentAnswers, assessmentSession } = useAppSelector((state) => state.learning.snapshot);
  const hasAssessmentDraft = assessmentSession
    ? assessmentSession.status !== "completed"
    : Object.keys(assessmentAnswers).length > 0 && !profile;
  const ctaPath = profile
    ? (progress.lessonStep > 0 ? "/lezione/precedenze" : "/oggi")
    : (hasAssessmentDraft ? "/valutazione" : "/inizia");

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.pageWidth}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}><Sparkles size={16} /> La patente, finalmente chiara</div>
              <h1>Non memorizzare<br />le risposte.<br /><em>Impara la strada.</em></h1>
              <p>
                Un percorso semplice e visivo per capire le regole, decifrare il linguaggio dei quiz e arrivare all’esame più consapevole.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.heroPrimary} to={ctaPath}>
                  {profile ? "Riprendi il percorso" : hasAssessmentDraft ? "Riprendi la valutazione" : "Inizia senza registrazione"}
                  <ArrowRight size={20} />
                </Link>
                <a className={styles.heroSecondary} href="#come-funziona">Scopri come funziona</a>
              </div>
              <div className={styles.reassurance}>
                <span><Check size={16} /> Nessuna registrazione</span>
                <span><Check size={16} /> Nessuna diagnosi</span>
                <span><Check size={16} /> I tuoi tempi</span>
              </div>
            </div>
            <RoadIllustration />
          </div>
        </div>
        <div className={styles.heroWave} aria-hidden="true" />
      </section>

      <section id="come-funziona" className={styles.section}>
        <div className={styles.pageWidth}>
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>IL TUO PERCORSO</span>
            <h2>Capire viene prima di rispondere</h2>
            <p>Ogni passo ha un obiettivo chiaro. Niente quiz casuali, niente corse.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article className={styles.stepCard} key={step.number}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <div className={styles.stepIcon}><Icon size={25} /></div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="accessibilita" className={`${styles.section} ${styles.supportSection}`}>
        <div className={`${styles.pageWidth} ${styles.supportGrid}`}>
          <div className={styles.supportDemo}>
            <div className={styles.demoHeader}>
              <span>Esempio di spiegazione</span>
              <button type="button" aria-label="Esempio del pulsante ascolta"><Volume2 size={17} /> Ascolta</button>
            </div>
            <p className={styles.demoQuestion}>Il segnale indica che devi <mark>dare la precedenza</mark> ai veicoli che arrivano da destra e da sinistra.</p>
            <div className={styles.wordChips}>
              <span><strong>devi</strong> = è obbligatorio</span>
              <span><strong>dare la precedenza</strong> = lasciar passare</span>
            </div>
            <div className={styles.demoFooter}><span className={styles.pulseDot} /> Spiegazione didattica, non testo ufficiale</div>
          </div>
          <div className={styles.supportCopy}>
            <span className={styles.kicker}>AIUTI CHE PUOI SCEGLIERE</span>
            <h2>Le parole difficili non devono fermarti</h2>
            <p>Guidami separa la regola dal modo in cui è scritta. Gli aiuti restano visibili mentre studi e si riducono gradualmente quando sei pronto.</p>
            <ul>
              <li><span><Headphones size={20} /></span><div><strong>Ascolta e ripeti</strong><small>Voce del dispositivo, velocità regolabile</small></div></li>
              <li><span><Eye size={20} /></span><div><strong>Guarda prima di leggere</strong><small>Situazioni visive e casi concreti</small></div></li>
              <li><span><BookOpenCheck size={20} /></span><div><strong>Semplifica senza sostituire</strong><small>Il testo originale resta sempre raggiungibile</small></div></li>
            </ul>
          </div>
        </div>
      </section>

      <section id="privacy" className={`${styles.section} ${styles.privacySection}`}>
        <div className={styles.pageWidth}>
          <div className={styles.privacyCard}>
            <div className={styles.privacyIllustration} aria-hidden="true">
              <div className={styles.deviceShape}><ShieldCheck size={54} /></div>
              <span className={styles.cloudOne}><Cloud /></span>
              <span className={styles.cloudTwo}><Cloud /></span>
            </div>
            <div className={styles.privacyCopy}>
              <span className={styles.kicker}>PRIVACY PRIMA DI TUTTO</span>
              <h2>I tuoi progressi sono tuoi.</h2>
              <p>Restano su questo dispositivo. Non creiamo un profilo Guidami e non conserviamo una copia centrale delle tue risposte.</p>
              <div className={styles.privacyPoints}>
                <span><LockKeyhole size={19} /> Salvataggio locale automatico</span>
                <span><Cloud size={19} /> Archivio online solo se lo scegli tu</span>
                <span><ShieldCheck size={19} /> Nessun dato di studio nelle statistiche di visita</span>
              </div>
              <Link to="/impostazioni">Gestisci i tuoi dati <ArrowRight size={17} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.pageWidth} ${styles.faqLayout}`}>
          <div className={styles.faqHeading}>
            <span className={styles.kicker}>DOMANDE COMUNI</span>
            <h2>Prima di iniziare, è giusto sapere.</h2>
            <p>Risposte chiare, come il percorso che vogliamo costruire con te.</p>
          </div>
          <div className={styles.faqList}>
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.pageWidth}>
          <span className={styles.miniRoad} aria-hidden="true" />
          <h2>Pronto a fare il primo passo?</h2>
          <p>Bastano pochi minuti. Non serve registrarsi.</p>
          <Link to={ctaPath}>{profile || hasAssessmentDraft ? "Continua da dove eri" : "Inizia il tuo percorso"}<ArrowRight size={20} /></Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.pageWidth} ${styles.footerGrid}`}>
          <div>
            <div className={styles.footerBrand}>guidami</div>
            <p>Un modo più umano di prepararsi alla teoria della patente.</p>
          </div>
          <div><strong>Guidami</strong><a href="#come-funziona">Come funziona</a><a href="#accessibilita">Accessibilità</a><Link to="/impostazioni">I tuoi dati</Link></div>
          <div><strong>Trasparenza</strong><a href="#privacy">Privacy</a><a href="#privacy">Dettagli tecnici</a><a href="https://www.ilportaledellautomobilista.it/" target="_blank" rel="noreferrer">Fonte quiz ministeriali</a></div>
        </div>
        <div className={`${styles.pageWidth} ${styles.footerBottom}`}>
          <span>© 2026 Guidami</span>
          <span>Nessun cookie pubblicitario · Nessuna IA sulle tue risposte</span>
        </div>
      </footer>
    </>
  );
}
