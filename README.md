# Guidami

Applicazione locale installabile per un percorso accessibile di preparazione alla teoria della patente B. La prima versione implementa pagina iniziale, introduzione, valutazione non diagnostica, profilo provvisorio, piano giornaliero, microlezione e gestione dei dati in IndexedDB.

## Avvio locale

Richiede Node.js 20 (vedi `.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

Verifiche disponibili:

```bash
npm run typecheck
npm test
npm run build
```

I progressi non vengono inviati a un sistema centrale: l'archivio operativo è IndexedDB. Esportazione e importazione usano copie di sicurezza JSON versionate. I contratti per gli archivi online sono indipendenti dal fornitore; Google Drive e OneDrive restano disattivati finché non vengono registrate le rispettive applicazioni OAuth.
