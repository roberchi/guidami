import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, Settings, X } from "lucide-react";
import { Brand } from "../ui/Brand";
import { useAppSelector } from "../../state/hooks";
import styles from "../../styles/App.module.scss";

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile, progress, assessmentAnswers, assessmentSession } = useAppSelector((state) => state.learning.snapshot);
  const hasAssessmentDraft = assessmentSession
    ? assessmentSession.status !== "completed"
    : Object.keys(assessmentAnswers).length > 0 && !profile;
  const resumePath = profile
    ? (progress.lessonStep > 0 ? "/lezione/precedenze" : "/oggi")
    : (hasAssessmentDraft ? "/valutazione" : "/inizia");

  return (
    <div className={styles.appShell}>
      <a className={styles.skipLink} href="#main-content">Vai al contenuto</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Brand />
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Navigazione principale">
            <NavLink to="/#come-funziona" onClick={() => setMenuOpen(false)}>Come funziona</NavLink>
            <NavLink to="/#accessibilita" onClick={() => setMenuOpen(false)}>Accessibilità</NavLink>
            <NavLink to="/#privacy" onClick={() => setMenuOpen(false)}>Privacy</NavLink>
            {profile ? <NavLink to="/oggi" onClick={() => setMenuOpen(false)}>Il mio percorso</NavLink> : null}
          </nav>
          <div className={styles.headerActions}>
            <Link className={styles.settingsLink} to="/impostazioni" aria-label="Apri impostazioni">
              <Settings size={20} />
            </Link>
            <Link className={styles.resumeButton} to={resumePath}>
              {profile || hasAssessmentDraft ? "Riprendi" : "Inizia"}
              <span aria-hidden="true">→</span>
            </Link>
            <button
              className={styles.menuButton}
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
