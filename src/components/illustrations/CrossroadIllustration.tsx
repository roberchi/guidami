import styles from "../../styles/App.module.scss";

export function CrossroadIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.crossroadVisual} ${compact ? styles.compactVisual : ""}`}>
      <svg viewBox="0 0 440 260" role="img" aria-label="Un'auto verde arriva a un incrocio mentre un'auto arancione arriva dalla sua destra">
        <rect width="440" height="260" rx="24" fill="#e5efe0" />
        <path d="M0 91h440v83H0zM178 0h84v260h-84z" fill="#5f6963" />
        <path d="M0 129h440M220 0v260" stroke="#fff9dc" strokeWidth="4" strokeDasharray="19 16" />
        <g transform="translate(220 211) rotate(-90)">
          <rect x="-29" y="-16" width="58" height="32" rx="9" fill="#3f9168" />
          <rect x="-13" y="-13" width="25" height="26" rx="4" fill="#dcebe2" />
          <circle cx="-18" cy="17" r="5" fill="#1e2c25" /><circle cx="18" cy="17" r="5" fill="#1e2c25" />
        </g>
        <g transform="translate(344 131) rotate(180)">
          <rect x="-29" y="-16" width="58" height="32" rx="9" fill="#ee8555" />
          <rect x="-13" y="-13" width="25" height="26" rx="4" fill="#f8e8d9" />
          <circle cx="-18" cy="17" r="5" fill="#1e2c25" /><circle cx="18" cy="17" r="5" fill="#1e2c25" />
        </g>
        <path d="M255 205q37-20 44-58" fill="none" stroke="#244638" strokeWidth="5" strokeLinecap="round" markerEnd="url(#arrow)" />
        <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m0 0 10 5-10 5z" fill="#244638" /></marker></defs>
        <g fill="#3d7357"><circle cx="45" cy="42" r="27"/><circle cx="394" cy="218" r="31"/></g>
      </svg>
      <span className={`${styles.carLabel} ${styles.greenLabel}`}>Tu</span>
      <span className={`${styles.carLabel} ${styles.orangeLabel}`}>Destra</span>
    </div>
  );
}
