import { ArrowRight, Clock3, HardDrive, Headphones, Pause, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import { ListenButton } from "../../components/ui/ListenButton";
import styles from "../../styles/App.module.scss";

export function WelcomePage() {
  const navigate = useNavigate();
  const intro = "Prima di iniziare, ti faremo sei domande brevi. Non è un esame e non ci sono voti. Puoi ascoltare ogni domanda, saltarla o fare una pausa.";

  return (
    <section className={styles.flowPage}>
      <div className={styles.flowPanel}>
        <div className={styles.flowProgress}><span style={{ width: "8%" }} /></div>
        <div className={styles.flowContent}>
          <span className={styles.flowKicker}>BENVENUTO</span>
          <h1>Iniziamo da come<br /><em>impari meglio.</em></h1>
          <p className={styles.flowLead}>{intro}</p>
          <ListenButton text={intro} label="Ascolta questa pagina" />
          <div className={styles.infoTiles}>
            <div><Clock3 /><strong>Circa 5 minuti</strong><span>Vai con calma</span></div>
            <div><Pause /><strong>Puoi fermarti</strong><span>Riprenderai da qui</span></div>
            <div><HardDrive /><strong>Solo sul dispositivo</strong><span>Nessuna registrazione</span></div>
          </div>
          <div className={styles.accessibilityReminder}>
            <div><Headphones size={22} /><span><strong>Ogni domanda si può ascoltare</strong><small>Useremo soltanto la voce del tuo dispositivo.</small></span></div>
            <div><Type size={22} /><span><strong>Il testo può essere ingrandito</strong><small>Puoi cambiarlo nelle impostazioni in alto.</small></span></div>
          </div>
          <div className={styles.flowActions}>
            <AppButton icon={<ArrowRight size={19} />} onClick={() => navigate("/valutazione")}>Cominciamo</AppButton>
            <button type="button" className={styles.textButton} onClick={() => navigate("/")}>Torna alla pagina iniziale</button>
          </div>
        </div>
      </div>
    </section>
  );
}
