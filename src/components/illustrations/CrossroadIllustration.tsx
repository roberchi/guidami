import styles from "../../styles/App.module.scss";
import { vehicleLanePositions } from "./crossroadGeometry";

type CrossroadIllustrationProps = {
  compact?: boolean;
  otherVehicleSide?: "left" | "right";
};

const vehicleVariants = {
  right: {
    color: "#ee8555",
    windowColor: "#f8e8d9",
    label: "Destra",
    ariaLabel: "Un'auto verde arriva a un incrocio mentre un'auto arancione arriva dalla sua destra",
    arrowPath: "M270 205q35-23 42-65"
  },
  left: {
    color: "#4f83a8",
    windowColor: "#e2eef5",
    label: "Sinistra",
    ariaLabel: "Un'auto verde arriva a un incrocio mentre un'auto blu arriva dalla sua sinistra",
    arrowPath: "M214 205q-35-23-42-65"
  }
} as const;

export function CrossroadIllustration({ compact = false, otherVehicleSide = "right" }: CrossroadIllustrationProps) {
  const { green } = vehicleLanePositions;
  const otherVehicle = vehicleLanePositions[otherVehicleSide];
  const variant = vehicleVariants[otherVehicleSide];

  return (
    <div className={`${styles.crossroadVisual} ${compact ? styles.compactVisual : ""}`}>
      <svg viewBox="0 0 440 260" role="img" aria-label={variant.ariaLabel}>
        <rect width="440" height="260" rx="24" fill="#e5efe0" />
        <path d="M0 91h440v83H0zM178 0h84v260h-84z" fill="#5f6963" />
        <path d="M0 129h440M220 0v260" stroke="#fff9dc" strokeWidth="4" strokeDasharray="19 16" />
        <g transform={`translate(${green.x} ${green.y}) rotate(${green.rotation})`}>
          <rect x="-29" y="-16" width="58" height="32" rx="9" fill="#3f9168" />
          <rect x="-13" y="-13" width="25" height="26" rx="4" fill="#dcebe2" />
          <circle cx="-18" cy="17" r="5" fill="#1e2c25" /><circle cx="18" cy="17" r="5" fill="#1e2c25" />
        </g>
        <g transform={`translate(${otherVehicle.x} ${otherVehicle.y}) rotate(${otherVehicle.rotation})`}>
          <rect x="-29" y="-16" width="58" height="32" rx="9" fill={variant.color} />
          <rect x="-13" y="-13" width="25" height="26" rx="4" fill={variant.windowColor} />
          <circle cx="-18" cy="17" r="5" fill="#1e2c25" /><circle cx="18" cy="17" r="5" fill="#1e2c25" />
        </g>
        <path d={variant.arrowPath} fill="none" stroke="#244638" strokeWidth="5" strokeLinecap="round" markerEnd="url(#arrow)" />
        <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m0 0 10 5-10 5z" fill="#244638" /></marker></defs>
        <g fill="#3d7357"><circle cx="45" cy="42" r="27"/><circle cx="394" cy="218" r="31"/></g>
      </svg>
      <span className={`${styles.carLabel} ${styles.greenLabel}`}>Tu</span>
      <span className={`${styles.carLabel} ${otherVehicleSide === "right" ? styles.orangeLabel : styles.blueLabel}`}>{variant.label}</span>
    </div>
  );
}
