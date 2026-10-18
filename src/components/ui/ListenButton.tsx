import { Volume2 } from "lucide-react";
import { speak } from "../../utils/speech";
import { useAppSelector } from "../../state/hooks";
import styles from "../../styles/App.module.scss";

export function ListenButton({ text, label = "Ascolta" }: { text: string; label?: string }) {
  const rate = useAppSelector((state) => state.learning.snapshot.preferences.speechRate);
  return (
    <button type="button" className={styles.listenButton} onClick={() => speak(text, rate)}>
      <Volume2 size={18} strokeWidth={2.2} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
