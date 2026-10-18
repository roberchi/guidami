import { useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, Check, Cloud, Download, HardDrive, MonitorCog, ShieldCheck, Trash2, Upload } from "lucide-react";
import { Modal, Slider, Switch } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import type { Preferences, TextSize } from "../../domain/models";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { clearLocalData, importBackup, updatePreferences } from "../../state/learningSlice";
import { learningRepository } from "../../storage/local/LearningRepository";
import styles from "../../styles/App.module.scss";

export function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const { snapshot, status, error } = useAppSelector((state) => state.learning);
  const [draft, setDraft] = useState<Preferences>(snapshot.preferences);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [notice, setNotice] = useState<string>();

  async function save(next: Preferences) {
    setDraft(next);
    await dispatch(updatePreferences(next)).unwrap();
    setNotice("Preferenze salvate");
  }

  async function exportData() {
    const content = await learningRepository.exportData();
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `guidami-copia-sicurezza-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Copia di sicurezza esportata");
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(importBackup(await file.text())).unwrap();
      setNotice("Copia di sicurezza importata correttamente");
    } catch {
      setNotice("Il file scelto non è una copia di sicurezza Guidami valida");
    }
    event.target.value = "";
  }

  async function deleteData() {
    await dispatch(clearLocalData()).unwrap();
    setDeleteOpen(false);
    navigate("/");
  }

  return (
    <section className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <div className={styles.pageWidth}>
          <span className={styles.flowKicker}>IMPOSTAZIONI E PRIVACY</span>
          <h1>Il tuo spazio, le tue scelte.</h1>
          <p>Personalizza la lettura e decidi sempre dove conservare i tuoi progressi.</p>
        </div>
      </div>
      <div className={`${styles.pageWidth} ${styles.settingsGrid}`}>
        <nav className={styles.settingsNav} aria-label="Sezioni delle impostazioni">
          <a href="#accesso"><MonitorCog /> Accessibilità</a>
          <a href="#salvataggio"><HardDrive /> Salvataggio</a>
          <a href="#dati"><ShieldCheck /> I tuoi dati</a>
        </nav>

        <div className={styles.settingsContent}>
          {notice ? <div className={styles.notice} role="status"><Check /> {notice}</div> : null}
          {error ? <div className={styles.errorNotice} role="alert">{error}</div> : null}

          <section id="accesso" className={styles.settingsSection}>
            <div className={styles.settingsSectionTitle}><MonitorCog /><div><h2>Accessibilità</h2><p>Rendi testi e movimenti più comodi per te.</p></div></div>
            <div className={styles.settingRow}>
              <div><strong>Dimensione del testo</strong><small>La modifica si applica subito a tutta l’app.</small></div>
              <div className={styles.segmented}>
                {(["standard", "large", "extra-large"] as TextSize[]).map((size) => (
                  <button key={size} type="button" className={draft.textSize === size ? styles.segmentActive : ""} onClick={() => void save({ ...draft, textSize: size })}>
                    {size === "standard" ? "A" : size === "large" ? "A+" : "A++"}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.settingRow}>
              <div><strong>Contrasto elevato</strong><small>Aumenta la separazione tra testo e sfondo.</small></div>
              <Switch size="lg" checked={draft.highContrast} onChange={(event) => void save({ ...draft, highContrast: event.currentTarget.checked })} aria-label="Contrasto elevato" />
            </div>
            <div className={styles.settingRow}>
              <div><strong>Riduci i movimenti</strong><small>Limita transizioni e animazioni decorative.</small></div>
              <Switch size="lg" checked={draft.reducedMotion} onChange={(event) => void save({ ...draft, reducedMotion: event.currentTarget.checked })} aria-label="Riduci i movimenti" />
            </div>
            <div className={styles.settingRow}>
              <div><strong>Velocità della voce</strong><small>Usata dal comando “Ascolta” del dispositivo.</small></div>
              <div className={styles.speechSlider}><span>Lenta</span><Slider min={0.6} max={1.2} step={0.1} value={draft.speechRate} onChange={value => setDraft({ ...draft, speechRate: value })} onChangeEnd={value => void save({ ...draft, speechRate: value })} /><span>Normale</span></div>
            </div>
          </section>

          <section id="salvataggio" className={styles.settingsSection}>
            <div className={styles.settingsSectionTitle}><HardDrive /><div><h2>Salvataggio e sincronizzazione</h2><p>Il salvataggio locale è sempre attivo.</p></div></div>
            <div className={styles.storageChoice}>
              <div className={styles.storageActive}>
                <span className={styles.storageIcon}><HardDrive /></span>
                <div><strong>Solo su questo dispositivo</strong><small>Salvataggio automatico nell’archivio locale</small></div>
                <span className={styles.activePill}><Check /> Attivo</span>
              </div>
              <div>
                <span className={styles.storageIcon}><Cloud /></span>
                <div><strong>Google Drive</strong><small>Area dati privata dell’app · configurazione in arrivo</small></div>
                <button type="button" disabled>Collega</button>
              </div>
              <div>
                <span className={styles.storageIcon}><Cloud /></span>
                <div><strong>Microsoft OneDrive</strong><small>Cartella privata dell’app · configurazione in arrivo</small></div>
                <button type="button" disabled>Collega</button>
              </div>
            </div>
            <p className={styles.storageFootnote}><ShieldCheck size={17} /> Nessuna autorizzazione a servizi online viene richiesta senza una tua scelta esplicita.</p>
          </section>

          <section id="dati" className={styles.settingsSection}>
            <div className={styles.settingsSectionTitle}><ShieldCheck /><div><h2>I tuoi dati</h2><p>Esporta una copia, ripristinala o elimina i progressi locali.</p></div></div>
            <div className={styles.dataActions}>
              <button type="button" onClick={() => void exportData()}><Download /><span><strong>Esporta una copia di sicurezza</strong><small>Scarica un file JSON portabile</small></span></button>
              <button type="button" onClick={() => fileInput.current?.click()}><Upload /><span><strong>Importa una copia di sicurezza</strong><small>Ripristina un file Guidami valido</small></span></button>
              <button type="button" className={styles.deleteAction} onClick={() => setDeleteOpen(true)}><Trash2 /><span><strong>Elimina dati locali</strong><small>Cancella valutazione, progressi e preferenze</small></span></button>
              <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(event) => void importData(event)} />
            </div>
            <div className={styles.technicalNote}><AlertTriangle /><p><strong>Da sapere</strong><br />Se cancelli i dati di navigazione, i progressi non esportati possono andare persi. La cancellazione locale e quella di un eventuale archivio online sono operazioni distinte.</p></div>
          </section>
        </div>
      </div>

      <Modal opened={deleteOpen} onClose={() => setDeleteOpen(false)} title="Eliminare tutti i dati locali?" centered classNames={{ content: styles.deleteModal, title: styles.modalTitle }}>
        <p>Questa operazione cancella valutazione, progressi e preferenze da questo dispositivo. Non può essere annullata senza una copia di sicurezza.</p>
        <div className={styles.modalActions}>
          <AppButton variant="ghost" onClick={() => setDeleteOpen(false)}>Annulla</AppButton>
          <AppButton variant="danger" disabled={status === "saving"} onClick={() => void deleteData()}>Elimina definitivamente</AppButton>
        </div>
      </Modal>
    </section>
  );
}
