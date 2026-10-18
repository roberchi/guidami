import { ArrowRight, BookOpen, CalendarClock, CalendarDays, Check, Clock3, Flame, LockKeyhole, Play, RotateCcw, Trophy } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { contentCatalog } from "../../content/catalog/catalog";
import { buildDailyPlan } from "../../domain/learning/buildDailyPlan";
import { buildIndicativePlan } from "../../domain/learning/buildIndicativePlan";
import { useAppSelector } from "../../state/hooks";
import styles from "../../styles/App.module.scss";

function planDateLabel(value: string, now: string): string {
  const planned = new Date(value);
  const current = new Date(now);
  const plannedDay = Date.UTC(planned.getFullYear(), planned.getMonth(), planned.getDate());
  const currentDay = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
  const dayDifference = Math.round((plannedDay - currentDay) / 86_400_000);
  if (dayDifference === 0) return "Oggi";
  if (dayDifference === 1) return "Domani";
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long" }).format(planned);
}

function activityTypeLabel(type: string): string {
  if (type === "lesson") return "Lezione";
  if (type === "review") return "Ripasso";
  if (type === "language") return "Allenamento linguistico";
  if (type === "simulation") return "Simulazione";
  return "Attività";
}

export function DashboardPage() {
  const { profile, progress } = useAppSelector((state) => state.learning.snapshot);
  const projection = useAppSelector((state) => state.learning.snapshot.learning.projection);
  const preferredName = "Ciao";
  const { plan, indicativePlan, now } = useMemo(() => {
    const generatedAt = new Date().toISOString();
    return {
      now: generatedAt,
      plan: buildDailyPlan({
        catalog: contentCatalog,
        projection,
        now: generatedAt,
        completedActivityIds: progress.completedLessons
      }),
      indicativePlan: buildIndicativePlan({
        catalog: contentCatalog,
        completedActivityIds: progress.completedLessons,
        startAt: profile?.assessmentCompletedAt ?? profile?.createdAt ?? generatedAt,
        now: generatedAt
      })
    };
  }, [profile?.assessmentCompletedAt, profile?.createdAt, progress.completedLessons, projection]);
  const mainActivity = plan.activities[0];
  const observedConcepts = Object.values(projection.conceptMastery)
    .filter((estimate) => estimate.level !== "unobserved").length;
  const nextReview = [...projection.reviews].sort((left, right) => left.dueAt.localeCompare(right.dueAt))[0];
  const nextReviewLabel = nextReview
    ? new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long" }).format(new Date(nextReview.dueAt))
    : "Dopo la prima attività";

  return (
    <section className={styles.dashboardPage}>
      <div className={styles.pageWidth}>
        <div className={styles.dashboardWelcome}>
          <div>
            <span className={styles.flowKicker}>{preferredName.toUpperCase()}</span>
            <h1>Cosa facciamo oggi?</h1>
            <p>{plan.summary} Durata stimata: circa {plan.estimatedMinutes || 5} minuti.</p>
          </div>
          <div className={styles.streakCard}><Flame /><span><strong>{progress.streakDays || 1}</strong><small>giorno di continuità</small></span></div>
        </div>

        <div className={styles.todayGrid}>
          <div className={styles.todayMain}>
            <div className={styles.todayHeader}>
              <span>IL PIANO DI OGGI</span>
              <span><Clock3 size={16} /> {plan.estimatedMinutes || 5} minuti</span>
            </div>
            {mainActivity ? <Link to={mainActivity.route} className={styles.mainActivity}>
              <div className={styles.mainActivityIcon}><BookOpen /></div>
              <div>
                <span>{mainActivity.type === "review" ? "RIPASSO IN SCADENZA" : "ATTIVITÀ CONSIGLIATA"} · {mainActivity.estimatedMinutes} MIN</span>
                <h2>{mainActivity.title}</h2>
                <p>{mainActivity.description}</p>
                <div className={styles.activityMeta}><span>{mainActivity.reason}</span></div>
              </div>
              <span className={styles.activityPlay}><Play size={19} fill="currentColor" /></span>
            </Link> : <div className={styles.mainActivity}><div className={styles.mainActivityIcon}><Check /></div><div><h2>Piano completato</h2><p>Non ci sono attività disponibili nel pacchetto attuale.</p></div></div>}
            <div className={styles.secondaryActivities}>
              {plan.activities.slice(1).map((activity) => (
                <article key={activity.activityId}>
                  <div className={styles.smallActivityIcon}><RotateCcw /></div>
                  <div><span>{activity.type === "review" ? "RIPASSO" : "ATTIVITÀ"} · {activity.estimatedMinutes} MIN</span><strong>{activity.title}</strong><small>{activity.reason}</small></div>
                  <Link to={activity.route} aria-label={`Inizia: ${activity.title}`}><ArrowRight /></Link>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.dashboardSide}>
            <div className={styles.progressCard}>
              <div><span>IL TUO PERCORSO</span><Trophy size={19} /></div>
              <div className={styles.progressRing}><strong>{observedConcepts}</strong><span>concetti<br />osservati</span></div>
              <div className={styles.progressLine}><span style={{ width: `${Math.max(5, (observedConcepts / contentCatalog.concepts.length) * 100)}%` }} /></div>
              <small>La preparazione cresce con esempi nuovi e ripassi nel tempo.</small>
            </div>
            <div className={styles.nextReview}>
              <CalendarClock size={23} />
              <div><strong>Prossimo ripasso</strong><span>{nextReviewLabel}</span></div>
            </div>
          </aside>
        </div>

        <section className={styles.indicativePlan} aria-labelledby="indicative-plan-title">
          <div className={styles.indicativePlanHeader}>
            <div>
              <span className={styles.flowKicker}>IL TUO PERCORSO</span>
              <h2 id="indicative-plan-title">Piano di massima</h2>
            </div>
            <p>È un piano di massima: può cambiare nel tempo in base ai risultati che ottieni.</p>
          </div>
          <div className={styles.indicativePlanNote}>
            <CalendarDays aria-hidden="true" />
            <p><strong>I giorni non sono vincolanti.</strong> Puoi iniziare subito il prossimo passo, anche se è previsto per un giorno successivo. Le altre attività si sbloccano una alla volta, in sequenza.</p>
          </div>
          <ol className={styles.indicativePlanList}>
            {indicativePlan.items.map((activity, index) => (
              <li
                key={activity.activityId}
                className={`${styles.indicativePlanItem} ${activity.status === "locked" ? styles.planItemLocked : ""}`}
              >
                <div className={styles.planStep} aria-hidden="true">
                  {activity.status === "completed" ? <Check /> : activity.status === "locked" ? <LockKeyhole /> : index + 1}
                </div>
                <div className={styles.planItemCopy}>
                  <span>{activityTypeLabel(activity.type)} · {activity.estimatedMinutes} min</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <small>{activity.reason}</small>
                </div>
                <div className={styles.planItemAction}>
                  <time dateTime={activity.plannedFor}>{planDateLabel(activity.plannedFor, now)}</time>
                  {activity.status === "completed" ? (
                    <Link to={activity.route} aria-label={`Rivedi: ${activity.title}`}>Rivedi</Link>
                  ) : activity.status === "available" ? (
                    <Link to={activity.route} aria-label={`Inizia: ${activity.title}`}>
                      {activity.startsEarly ? "Inizia in anticipo" : "Inizia"}<ArrowRight />
                    </Link>
                  ) : (
                    <span><LockKeyhole aria-hidden="true" /> In sequenza</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

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
