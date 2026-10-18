import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader } from "@mantine/core";
import { AppLayout } from "../components/layout/AppLayout";
import { LandingPage } from "../features/landing/LandingPage";
import { WelcomePage } from "../features/onboarding/WelcomePage";
import { AssessmentPage } from "../features/assessment/AssessmentPage";
import { ProfilePage } from "../features/assessment/ProfilePage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { LessonPage } from "../features/lesson/LessonPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { bootstrapApp } from "../state/learningSlice";
import styles from "../styles/App.module.scss";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
}

export function App() {
  const dispatch = useAppDispatch();
  const { status, snapshot } = useAppSelector((state) => state.learning);

  useEffect(() => {
    void dispatch(bootstrapApp());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dataset.textSize = snapshot.preferences.textSize;
    document.documentElement.dataset.contrast = snapshot.preferences.highContrast ? "high" : "standard";
    document.documentElement.dataset.motion = snapshot.preferences.reducedMotion ? "reduced" : "full";
  }, [snapshot.preferences]);

  if (status === "idle" || status === "loading") {
    return (
      <main className={styles.bootScreen} aria-label="Caricamento dell’applicazione">
        <div className={styles.bootLogo}>G</div>
        <Loader color="forest" size="sm" />
        <p>Prepariamo il tuo percorso…</p>
      </main>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/inizia" element={<WelcomePage />} />
          <Route path="/valutazione" element={<AssessmentPage />} />
          <Route
            path="/profilo"
            element={snapshot.profile ? <ProfilePage /> : <Navigate to="/valutazione" replace />}
          />
          <Route
            path="/oggi"
            element={snapshot.profile ? <DashboardPage /> : <Navigate to="/inizia" replace />}
          />
          <Route
            path="/lezione/precedenze"
            element={snapshot.profile ? <LessonPage /> : <Navigate to="/inizia" replace />}
          />
          <Route path="/impostazioni" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
