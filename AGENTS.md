# Istruzioni operative per gli agenti

Queste regole si applicano all’intero repository. Le specifiche in `specs/` sono la fonte di verità funzionale e tecnica; in caso di dubbio, non introdurre comportamenti che le contraddicano.

## Lingua e comunicazione

- Tutti i testi visibili dell’applicazione devono essere in italiano, compresi messaggi di errore, attributi di accessibilità, metadati PWA e testi delle notifiche.
- I nomi propri dei servizi e gli identificatori tecnici possono restare nella forma ufficiale quando non esiste un equivalente italiano utile.
- Codice, nomi di tipi e identificatori possono essere in inglese; commenti e documentazione del progetto devono essere chiari e coerenti.
- Al termine di un lavoro, indicare branch, verifiche eseguite, eventuali limiti e stato del working tree.

## Protezione di `main`

- `main` è collegato alla distribuzione Vercel e deve rimanere stabile.
- Non sviluppare, creare commit o eseguire push direttamente su `main`.
- Ogni funzionalità, correzione o attività di manutenzione deve vivere in un branch dedicato.
- L’utente apre e gestisce le pull request verso `main`: non creare o unire una pull request salvo richiesta esplicita.
- Non eseguire merge, rebase, force push, reset distruttivi o riscritture della cronologia senza autorizzazione esplicita.

## Gestione dei branch

1. Prima di modificare file, verificare sempre `git status -sb` e il branch corrente.
2. Partire da un `main` pulito e allineato con `origin/main`, oppure dichiarare chiaramente quando il branch è basato su un altro branch non ancora unito.
3. Creare un branch distinto per ogni attività, usando uno dei prefissi seguenti:
   - `feature/` per nuove funzionalità;
   - `fix/` per correzioni;
   - `test/` per interventi dedicati ai test;
   - `docs/` per sola documentazione;
   - `chore/` per configurazione e manutenzione.
4. Usare nomi brevi e descrittivi in formato kebab-case, per esempio `feature/ripasso-dilazionato`.
5. Non mescolare modifiche non correlate nello stesso branch.
6. Prima del push verificare che il branch tracci il remoto corretto e che il working tree non contenga file accidentali.

Se sono già presenti modifiche non committate, preservarle: non spostarle, eliminarle o sovrascriverle senza averne verificato origine e scopo.

## Changelog obbligatorio

- `CHANGELOG.md` deve essere aggiornato **prima di ogni commit**.
- Nessun commit è ammesso se il changelog non è incluso tra i file preparati per lo stesso commit.
- Inserire le modifiche nella sezione `## [Non pubblicato]`, scegliendo una delle categorie:
  - `### Aggiunto`;
  - `### Modificato`;
  - `### Corretto`;
  - `### Rimosso`;
  - `### Sicurezza`;
  - `### Note`.
- Descrivere il risultato percepibile o il cambiamento tecnico rilevante, non la sequenza dei comandi eseguiti.
- Evitare duplicati e mantenere voci brevi, specifiche e in italiano.
- Anche i commit di documentazione, test o manutenzione devono avere una voce coerente nel changelog.
- Prima del commit controllare esplicitamente con `git diff --cached` che `CHANGELOG.md` sia preparato insieme alle modifiche.

## Dipendenze e ambiente

- Usare Node.js 20, come indicato in `.nvmrc`.
- Installare le dipendenze da lockfile con `npm ci --legacy-peer-deps` quando `node_modules` non è disponibile.
- Non modificare manualmente `package-lock.json`.
- Non aggiungere dipendenze senza una motivazione concreta legata alle specifiche.
- Non inserire segreti, token, credenziali o identificativi riservati nel repository.

## Verifiche obbligatorie

Durante lo sviluppo eseguire i test mirati alle aree modificate. Prima di ogni commit che tocca codice, configurazione o dipendenze, eseguire l’intera suite:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Regole aggiuntive:

- Non correggere un test eliminandolo, indebolendo le asserzioni o nascondendo un errore reale.
- Aggiungere o aggiornare test quando cambia una regola di dominio, la persistenza, la sincronizzazione o un comportamento interattivo importante.
- Per una modifica esclusivamente documentale è sufficiente verificare `git diff --check`; dichiarare esplicitamente che la suite applicativa non è stata rieseguita perché il codice non è cambiato.
- Se un controllo fallisce, non creare il commit come se fosse valido: correggere il problema oppure riportare con precisione il blocco.
- Non includere nel commit `dist/`, `node_modules/`, coperture o altri artefatti generati.

## Commit e push

- Creare commit e push soltanto quando richiesto dall’utente.
- Prima del commit verificare:
  1. branch corretto;
  2. changelog aggiornato e preparato;
  3. diff privo di segreti e modifiche estranee;
  4. verifiche richieste superate;
  5. `git diff --cached --check` senza errori.
- Usare messaggi Conventional Commits concisi, per esempio:
  - `feat: aggiunge il ripasso dilazionato`;
  - `fix: conserva le risposte alla riapertura`;
  - `test: copre la fusione degli eventi concorrenti`;
  - `docs: documenta il flusso dei branch`.
- Dopo il commit, mostrare hash e oggetto del commit e verificare nuovamente `git status -sb`.
- Per il primo push usare il branch corrente come upstream, mai `main`.
- Non usare `--force` o `--force-with-lease` senza richiesta esplicita.

## Vincoli del prodotto

- L’applicazione deve restare una SPA/PWA solo frontend, utilizzabile senza registrazione e senza backend applicativo.
- IndexedDB è la fonte operativa primaria dei dati dello studente.
- La sincronizzazione remota è facoltativa e può comunicare soltanto con il fornitore esplicitamente autorizzato dall’utente.
- Non inviare risposte, punteggi o progressi a strumenti di analisi, servizi di IA o endpoint proprietari.
- Non presentare esercizi redazionali come quiz ministeriali ufficiali.
- Non introdurre diagnosi, etichette cliniche o promesse di superamento dell’esame.
- Conservare accessibilità, navigazione da tastiera, contrasto, riduzione dei movimenti e lettura vocale locale.
- Le modifiche alla persistenza devono preservare compatibilità, validazione, atomicità e possibilità di ripristino.

## Organizzazione del codice

- Mantenere la logica di dominio deterministica e separata dai componenti React.
- Redux rappresenta lo stato operativo; IndexedDB resta l’archivio durevole.
- Usare i contratti in `src/storage/models/` per evitare dipendenze della UI da un fornitore cloud specifico.
- Preferire componenti accessibili riutilizzabili e SCSS Modules; mantenere i token visivi centralizzati.
- Non aggiungere servizi dinamici o generazione remota di contenuti didattici.

## Consegna del lavoro

Prima di considerare conclusa un’attività:

1. controllare il diff completo e l’assenza di modifiche estranee;
2. aggiornare `CHANGELOG.md`;
3. eseguire le verifiche applicabili;
4. riportare eventuali funzioni non attivate o dipendenti da credenziali esterne;
5. se commit e push sono stati richiesti, verificare che il branch remoto contenga l’hash atteso;
6. fornire all’utente il collegamento per aprire la pull request, senza unirla automaticamente.
