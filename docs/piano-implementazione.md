# Piano di implementazione

**Versione:** 1.0
**Data:** 18 ottobre 2026
**Stato:** in esecuzione
**Riferimenti:** `specs/patente_specifiche_funzionali.md`, `specs/patente-tutor-storage-sync-spec.md`, `specs/frontend-application-architecture.md`

## Obiettivo

Portare Guidami dall’MVP dimostrativo a una SPA/PWA locale completa, verificabile e pronta a ricevere contenuti ministeriali autorizzati e credenziali OAuth pubbliche. Ogni fase produce un incremento autonomo, testato e revisionabile tramite una pull request dedicata.

## Principi di esecuzione

- `main` resta sempre distribuibile e viene modificato soltanto tramite pull request.
- Ogni fase usa un branch distinto e aggiorna `CHANGELOG.md` prima di ogni commit.
- Le dipendenze tra fasi sono esplicite; un branch successivo parte dal `main` che include le fasi necessarie.
- Contenuti dimostrativi ed editoriali sono sempre marcati come non ufficiali.
- Quiz ministeriali reali entrano nel catalogo soltanto dopo verifica di fonte, licenza, completezza e revisione.
- Google Drive e Microsoft OneDrive restano disattivati finché mancano registrazioni OAuth valide.
- Tutte le decisioni adattive sono deterministiche, versionate e testate senza servizi di IA.

## Stato sintetico

| Fase | Branch previsto | Stato | Dipendenze principali |
|---|---|---|---|
| 1. Fondazioni del dominio | `feature/learning-domain-foundation` | In corso | MVP integrato |
| 2. Assessment adattivo | `feature/adaptive-assessment` | Pianificata | Fase 1 |
| 3. Percorso e tutor linguistico | `feature/guided-learning-path` | Pianificata | Fasi 1–2 |
| 4. Quiz e simulazioni | `feature/quiz-and-exam-simulation` | Pianificata | Fasi 1–3, contenuti autorizzati |
| 5. Piano e progressi | `feature/progress-and-review` | Pianificata | Fasi 1–4 |
| 6. Sincronizzazione cloud | `feature/cloud-sync` | Pianificata | Fase 1, registrazioni OAuth |
| 7. Importazione ed editoria | `feature/content-import-tools` | Pianificata | Fasi 1 e 4, verifica licenza |
| 8. Qualità e rilascio | `chore/release-readiness` | Pianificata | Fasi precedenti |

## Fase 1 — Fondazioni del dominio

### Scopo

Definire contratti stabili per contenuti, tassonomie, tentativi, padronanza, ripassi e piano giornaliero. Sostituire le decisioni didattiche codificate nelle schermate con funzioni pure e versionate.

### Attività

- Creare tassonomie essenziali per argomenti, concetti e caratteristiche linguistiche.
- Introdurre un catalogo statico versionato con provenienza, stato editoriale e distinzione tra materiale didattico e domanda ufficiale.
- Definire tentativi di apprendimento con autonomia, aiuti, variante, correttezza e tempo orientativo.
- Separare la padronanza dei concetti dalla comprensione linguistica.
- Implementare una proiezione deterministica dagli eventi e una stima prudente della confidenza.
- Implementare ripassi a 1, 3, 7 e 14 giorni, senza consolidare sulla sola ripetizione immediata.
- Generare un piano giornaliero di massimo tre attività con motivazione comprensibile.
- Estendere lo schema IndexedDB mantenendo compatibilità con i dati MVP.

### Criteri di uscita

- Catalogo validato a runtime e privo di elementi dichiarati ufficiali senza fonte autorizzata.
- Test per progressione, aiuti, varianti nuove, ripassi differiti e priorità del piano.
- Migrazione dei dati MVP senza perdita di profilo, preferenze o lezioni completate.
- Nessuna percentuale mostrata come probabilità clinica o di superamento.

## Fase 2 — Assessment adattivo

### Scopo

Passare dalla prova lineare a un assessment multimodale che raccoglie evidenze separate e propone verifiche supplementari solo quando servono.

### Attività

- Separare autovalutazione e prove pratiche.
- Aggiungere modalità visuale, testuale semplice, linguistica e formulazione originale quando disponibile.
- Registrare tempi orientativi, ascolti, aiuti, cambi di risposta e interruzioni.
- Controbilanciare ordine e difficoltà con una configurazione versionata.
- Calcolare confidenza per conoscenze, linguaggio e utilità dei supporti.
- Salvare il punto esatto della sessione e riprenderlo dopo riapertura.
- Mostrare “da verificare” quando le osservazioni sono insufficienti.

### Criteri di uscita

- Una singola risposta non determina il profilo.
- Le difficoltà concettuali e linguistiche restano separate.
- L’utente può ascoltare, saltare, interrompere e riprendere ogni prova.
- Il risultato propone immediatamente un’attività motivata.

## Fase 3 — Microlezioni e tutor linguistico

### Scopo

Rendere le lezioni interamente guidate dal catalogo e aggiungere gli strumenti linguistici previsti dalle specifiche.

### Attività

- Motore di microlezioni con obiettivo, regola, esempio, trasferimento e verifica.
- Livelli di aiuto: spiegazione, indizio, domanda autonoma e verifica senza aiuti.
- Segmentazione delle frasi, evidenziazione di negazioni e condizioni, parafrasi marcata e glossario contestuale.
- Percorsi mirati su negazioni, eccezioni, assoluti, verbi modali e termini confondibili.
- Trascrizioni accessibili e sintesi vocale esclusivamente locale.
- Registrazione distinta dei tentativi con e senza aiuti.

### Criteri di uscita

- Almeno un caso nuovo per ogni concetto pilota.
- Testo ufficiale, quando presente, immutabile e sempre distinguibile dalla spiegazione.
- Gli aiuti non vengono conteggiati come risposta autonoma.

## Fase 4 — Quiz per argomento e simulazioni

### Scopo

Offrire sessioni per argomento, simulazioni fedeli configurabili e un debrief non giudicante.

### Attività

- Repository dei quiz versionato con fonte, hash, licenza e stato di revisione.
- Sessioni per argomento con feedback editoriale e casi equivalenti.
- Simulazione fedele senza glossario, parafrasi, indizi o feedback durante la prova.
- Modalità assistita separata e chiaramente etichettata.
- Timer, navigazione, invio e parametri d’esame da configurazione verificata.
- Debrief per concetti e strutture linguistiche con tre attività successive.

### Criteri di uscita

- Nessun contenuto dimostrativo è presentato come ministeriale.
- Le risposte ufficiali sono immutabili per versione.
- La simulazione è riprendibile soltanto secondo la regola esplicita scelta per la modalità.
- Nessuna probabilità numerica di promozione.

## Fase 5 — Piano giornaliero e progressi

### Scopo

Collegare tutte le evidenze al piano giornaliero, ai ripassi e a una dashboard longitudinale comprensibile.

### Attività

- Piano dinamico con nuovo concetto, ripasso in scadenza ed eventuale esercizio linguistico.
- Sessione breve da cinque minuti e massimo tre attività principali.
- Indicatori descrittivi per copertura, autonomia, consolidamento e incertezza.
- Cronologia di apprendimento e confronto tra verifiche assistite e autonome.
- Revisione errori senza diagnosi automatica.
- Motivazioni visibili per ogni attività consigliata.

### Criteri di uscita

- Priorità: lacune fondamentali, ripassi scaduti, difficoltà ricorrenti, nuovi argomenti e verifica.
- Nessun blocco permanente di livello.
- La scelta manuale non cancella il piano suggerito.

## Fase 6 — Persistenza e sincronizzazione cloud

### Scopo

Completare il motore append-only e attivare la sincronizzazione diretta con gli spazi privati dei fornitori.

### Attività

- Batch immutabili, checksum, outbox, registro remoto e retry idempotente.
- Scaricamento, validazione, deduplicazione e ricostruzione deterministica.
- Gestione offline, errori 401/403/429/5xx e backoff con variazione casuale.
- Google Identity Services con solo `drive.appdata`.
- Microsoft Authentication Library con PKCE e cartella applicativa OneDrive.
- Isolamento per account, cambio account, disconnessione e cancellazione separata.
- Migrazione verificata tra fornitori senza cancellare automaticamente l’origine.

### Criteri di uscita

- La perdita di connettività non impedisce lo studio né la scrittura locale.
- Due dispositivi offline confluiscono senza perdita o duplicazione.
- Token e credenziali non vengono persistiti nei dati di studio.
- Le integrazioni reali vengono pubblicate soltanto dopo test con account supportati.

## Fase 7 — Importazione ed editoria

### Scopo

Preparare pipeline e strumenti locali per contenuti autorizzati e schede pregresse.

### Attività

- Validazione di formato, codifica, unicità, soluzione e riferimenti multimediali.
- Quarantena dei record incompleti o ambigui.
- Tracciabilità da quiz a fonte, versione, concetti, spiegazioni e revisioni.
- Importazione manuale o da file delle schede pregresse con conferma dei dati estratti.
- Associazione soltanto quando l’identificazione è sufficientemente certa.
- Rapporto di qualità e possibilità di annullare un pacchetto pubblicato.

### Criteri di uscita

- Nessun pacchetto è pubblicabile senza fonte, licenza e controllo di qualità.
- Le corrispondenze incerte non vengono inventate.
- Le schede pregresse restano segnali iniziali e non diagnosi.

## Fase 8 — Qualità, accessibilità e rilascio

### Scopo

Verificare i flussi completi, l’uso offline, la sicurezza e l’esperienza accessibile prima del rilascio.

### Attività

- Test di componente e integrazione per i flussi principali.
- Prove end-to-end per primo accesso, ripresa, studio, simulazione e ripristino.
- Audit WCAG 2.2 AA, tastiera, lettore di schermo, contrasto e ingrandimento.
- Verifica PWA installabile, precaricamento, aggiornamenti e migrazioni.
- Controllo delle richieste di rete per escludere dati di studio da strumenti di analisi.
- Verifiche di sicurezza su importazioni, contenuti, token, criteri CSP e dipendenze.
- Bilancio prestazioni e suddivisione dei moduli caricati.

### Criteri di uscita

- Suite automatica completa verde e flussi critici verificati sui formati principali.
- Studio locale disponibile senza rete dopo il primo caricamento.
- Nessun dato di apprendimento inviato a endpoint non autorizzati.
- Limiti, fonti e funzioni non attive documentati nell’interfaccia e nel rilascio.

## Vincoli esterni e decisioni necessarie

| Vincolo | Effetto | Azione richiesta |
|---|---|---|
| Licenza e banca quiz ufficiale non presenti | Blocca la pubblicazione di quiz dichiarati ministeriali e simulazioni fedeli reali | Ottenere pacchetto, fonte, licenza e revisione |
| Parametri d’esame da riconfermare | Impedisce di dichiarare fedeltà normativa definitiva | Validazione legale/editoriale prima del rilascio |
| Identificativi OAuth assenti | Blocca i collegamenti reali a Google e Microsoft | Registrare le applicazioni SPA e configurare gli identificativi pubblici |
| Revisione didattica non documentata | Limita l’uso dei contenuti pilota | Approvazione da esperti normativi e didattici |
| Test con utenti non eseguiti | Impedisce affermazioni di efficacia | Piano di ricerca e consenso appropriato |

## Regola di completamento

Una fase è completata soltanto quando codice, test, migrazioni, accessibilità, changelog e documentazione sono coerenti; i criteri di uscita sono verificati; il branch è pronto per una pull request; e i limiti esterni residui sono dichiarati senza simulare funzionalità attive.
