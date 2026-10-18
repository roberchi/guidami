import { ArrowRight, BookOpen, CalendarClock, Check, Clock3, Flame, Languages, Play, RotateCcw, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../state/hooks";
import styles from "../../styles/App.module.scss";

export function DashboardPage() {
  const { profile, progress } = useAppSelector((state) => state.learning.snapshot);
  const completed = progress.completedLessons.includes("precedenze-base");
  const preferredName = "Ciao";

  return (
    <section className={styles.dashboardPage}>
      <div className={styles.pageWidth}>
        <div className={styles.dashboardWelcome}>
          <div>
            <span className={styles.flowKicker}>{preferredName.toUpperCase()}</span>
            <h1>Cosa facciamo oggi?</h1>
            <p>Un piccolo passo alla volta. Il piano richiede circa 12 minuti.</p>
          </div>
          <div className={styles.streakCard}><Flame /><span><strong>{progress.streakDays || 1}</strong><small>giorno di continuità</small></span></div>
        </div>

        <div className={styles.todayGrid}>
          <div className={styles.todayMain}>
            <div className={styles.todayHeader}>
              <span>IL PIANO DI OGGI</span>
              <span><Clock3 size={16} /> 12 minuti</span>
            </div>
            <Link to="/lezione/precedenze" className={styles.mainActivity}>
              <div className={styles.mainActivityIcon}>{completed ? <Check /> : <BookOpen />}</div>
              <div>
                <span>{completed ? "COMPLETATA · PUOI RIPASSARLA" : "NUOVO CONCETTO · 7 MIN"}</span>
                <h2>Le precedenze agli incroci</h2>
                <p>Capisci la regola con una situazione visiva, poi usala in un caso nuovo.</p>
                <div className={styles.activityMeta}><span>Livello base</span><span>Immagini + audio</span></div>
              </div>
              <span className={styles.activityPlay}><Play size={19} fill="currentColor" /></span>
            </Link>
            <div className={styles.secondaryActivities}>
              <article>
                <div className={styles.smallActivityIcon}><RotateCcw /></div>
                <div><span>RIPASSO · 3 MIN</span><strong>I segnali di pericolo</strong><small>3 domande su casi diversi</small></div>
                <button type="button" disabled aria-label="Disponibile dopo la prima lezione"><ArrowRight /></button>
              </article>
              <article>
                <div className={styles.smallActivityIcon}><Languages /></div>
                <div><span>PAROLE DEI QUIZ · 2 MIN</span><strong>“Può” oppure “deve”?</strong><small>Impara a riconoscere l’obbligo</small></div>
                <button type="button" disabled aria-label="Disponibile dopo la prima lezione"><ArrowRight /></button>
              </article>
            </div>
          </div>

          <aside className={styles.dashboardSide}>
            <div className={styles.progressCard}>
              <div><span>IL TUO PERCORSO</span><Trophy size={19} /></div>
              <div className={styles.progressRing}><strong>{completed ? "1" : "0"}</strong><span>concetti<br />completati</span></div>
              <div className={styles.progressLine}><span style={{ width: completed ? "18%" : "5%" }} /></div>
              <small>La preparazione cresce con esempi nuovi e ripassi nel tempo.</small>
            </div>
            <div className={styles.nextReview}>
              <CalendarClock size={23} />
              <div><strong>Prossimo ripasso</strong><span>{completed ? "Domani · Precedenze" : "Dopo la prima lezione"}</span></div>
            </div>
          </aside>
        </div>

        <div className={styles.dashboardNotice}>
          <Check size={18} />
          <span><strong>Il tuo lavoro viene salvato automaticamente.</strong> Tutto resta su questo dispositivo.</span>
          <Link to="/impostazioni">Gestisci dati</Link>
        </div>
        <p className={styles.profileFootnote}>Piano basato su un profilo con affidabilità <strong>{profile?.confidence}</strong>. Le proposte cambieranno con nuove evidenze.</p>
      </div>
    </section>
  );
}
