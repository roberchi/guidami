import { Link } from "react-router-dom";
import styles from "../../styles/App.module.scss";

export function Brand() {
  return (
    <Link to="/" className={styles.brand} aria-label="Guidami, torna alla pagina iniziale">
      <span className={styles.brandMark} aria-hidden="true">
        <span />
      </span>
      <span>guidami</span>
    </Link>
  );
}
