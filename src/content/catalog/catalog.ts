import type { ContentCatalog } from "./types";

export const contentCatalog: ContentCatalog = {
  releaseId: "editorial-pilot-2026-10",
  schemaVersion: 1,
  publishedAt: "2026-10-18T00:00:00.000Z",
  topics: [
    {
      id: "precedenze",
      label: "Precedenze",
      description: "Ordine di passaggio agli incroci e comportamento prudente.",
      order: 1
    },
    {
      id: "segnali-pericolo",
      label: "Segnali di pericolo",
      description: "Riconoscimento dei pericoli annunciati dalla segnaletica.",
      order: 2
    },
    {
      id: "comportamento",
      label: "Comportamento",
      description: "Obblighi, possibilità e condotte sicure sulla strada.",
      order: 3
    }
  ],
  concepts: [
    {
      id: "precedenza-destra",
      topicId: "precedenze",
      label: "Precedenza a destra",
      description: "In assenza di segnali si lascia passare chi arriva da destra.",
      prerequisiteIds: [],
      fundamental: true
    },
    {
      id: "incrocio-senza-segnali",
      topicId: "precedenze",
      label: "Incrocio senza segnali",
      description: "Riconoscere quando applicare la regola generale di precedenza.",
      prerequisiteIds: ["precedenza-destra"],
      fundamental: true
    },
    {
      id: "segnale-pericolo",
      topicId: "segnali-pericolo",
      label: "Funzione dei segnali di pericolo",
      description: "I segnali triangolari avvisano di un pericolo da affrontare con prudenza.",
      prerequisiteIds: [],
      fundamental: true
    },
    {
      id: "obbligo-possibilita",
      topicId: "comportamento",
      label: "Obbligo e possibilità",
      description: "Distinguere un comportamento obbligatorio da uno consentito.",
      prerequisiteIds: [],
      fundamental: false
    }
  ],
  languageFeatures: [
    {
      id: "negazione",
      label: "Negazione",
      description: "Frasi che contengono non, mai o una doppia negazione.",
      examples: ["non è vietato", "non deve mai"]
    },
    {
      id: "verbi-modali",
      label: "Può e deve",
      description: "Differenza tra possibilità, permesso e obbligo.",
      examples: ["può proseguire", "deve fermarsi"]
    },
    {
      id: "eccezione",
      label: "Eccezioni",
      description: "Frasi con salvo, tranne o eccetto.",
      examples: ["salvo diversa segnalazione", "eccetto i residenti"]
    },
    {
      id: "assoluti",
      label: "Parole assolute",
      description: "Parole come sempre, mai, solo e in ogni caso.",
      examples: ["deve sempre", "in ogni caso"]
    },
    {
      id: "termini-confondibili",
      label: "Termini confondibili",
      description: "Parole vicine nel linguaggio comune ma diverse nelle regole stradali.",
      examples: ["fermata e sosta", "carreggiata e corsia"]
    }
  ],
  exercises: [
    {
      id: "precedenza-destra-visuale-a",
      version: 1,
      kind: "concept-check",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["precedenze"],
      conceptIds: ["precedenza-destra", "incrocio-senza-segnali"],
      languageFeatureIds: [],
      prerequisiteConceptIds: [],
      difficulty: 1,
      transferGroupId: "precedenza-destra-visuale",
      visual: "crossroad-right",
      prompt: "Se un veicolo arriva dalla tua destra in un incrocio senza segnali, chi passa prima?",
      simplifiedPrompt: "Guarda a destra: se arriva un veicolo, lo lasci passare.",
      segments: ["Se un veicolo arriva dalla tua destra", "in un incrocio senza segnali", "chi passa prima?"],
      glossary: [{ term: "dare la precedenza", explanation: "Rallentare o fermarsi per lasciare passare." }],
      options: [
        { id: "right", text: "Il veicolo che arriva da destra" },
        { id: "me", text: "Il mio veicolo" }
      ],
      correctOptionId: "right",
      feedback: {
        correct: "Hai applicato la regola della precedenza a destra.",
        incorrect: "In assenza di segnali, controlla chi arriva dalla tua destra.",
        uncertain: "Verifichiamo la regola con un altro incrocio."
      }
    },
    {
      id: "precedenza-destra-visuale-b",
      version: 1,
      kind: "concept-check",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["precedenze"],
      conceptIds: ["precedenza-destra"],
      languageFeatureIds: [],
      prerequisiteConceptIds: [],
      difficulty: 2,
      transferGroupId: "precedenza-destra-visuale",
      visual: "crossroad-left",
      prompt: "Nessun veicolo arriva dalla tua destra. Un veicolo arriva da sinistra. Chi può passare per primo?",
      simplifiedPrompt: "La tua destra è libera: puoi passare con prudenza.",
      segments: ["Nessun veicolo arriva dalla tua destra", "un veicolo arriva da sinistra", "chi può passare per primo?"],
      glossary: [{ term: "con prudenza", explanation: "Controllando comunque che sia sicuro proseguire." }],
      options: [
        { id: "me", text: "Il mio veicolo" },
        { id: "left", text: "Il veicolo che arriva da sinistra" }
      ],
      correctOptionId: "me",
      feedback: {
        correct: "Hai trasferito la regola a una situazione diversa.",
        incorrect: "Il veicolo a sinistra deve dare la precedenza a te.",
        uncertain: "Proviamo a indicare prima destra e sinistra."
      }
    },
    {
      id: "precedenza-destra-visuale-c",
      version: 1,
      kind: "concept-check",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["precedenze"],
      conceptIds: ["precedenza-destra", "incrocio-senza-segnali"],
      languageFeatureIds: [],
      prerequisiteConceptIds: ["precedenza-destra"],
      difficulty: 2,
      transferGroupId: "precedenza-destra-visuale",
      visual: "crossroad-right",
      prompt: "A un incrocio senza segnali, un veicolo arriva dalla tua destra e svolta. Chi deve passare per primo?",
      simplifiedPrompt: "Anche se svolta, il veicolo arriva da destra: lo lasci passare.",
      segments: ["A un incrocio senza segnali", "un veicolo arriva dalla tua destra e svolta", "chi deve passare per primo?"],
      glossary: [{ term: "svolta", explanation: "Cambia direzione verso un’altra strada." }],
      options: [
        { id: "right", text: "Il veicolo che arriva da destra" },
        { id: "me", text: "Il mio veicolo" }
      ],
      correctOptionId: "right",
      feedback: {
        correct: "Hai applicato la precedenza a destra anche con una manovra diversa.",
        incorrect: "La svolta non cambia la regola: senza segnali, lasci passare chi arriva da destra.",
        uncertain: "Individua prima da quale lato arriva l’altro veicolo."
      }
    },
    {
      id: "linguaggio-puo-deve-a",
      version: 1,
      kind: "language-training",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["comportamento"],
      conceptIds: ["obbligo-possibilita"],
      languageFeatureIds: ["verbi-modali"],
      prerequisiteConceptIds: [],
      difficulty: 1,
      transferGroupId: "verbi-modali-base",
      visual: "language",
      prompt: "La parola “deve” indica una possibilità oppure un obbligo?",
      simplifiedPrompt: "“Deve” significa che è obbligatorio.",
      segments: ["La parola “deve”", "indica una possibilità", "oppure un obbligo?"],
      glossary: [
        { term: "deve", explanation: "Indica un obbligo." },
        { term: "può", explanation: "Indica una possibilità o un permesso." }
      ],
      options: [
        { id: "obligation", text: "Un obbligo" },
        { id: "possibility", text: "Una possibilità" }
      ],
      correctOptionId: "obligation",
      feedback: {
        correct: "Hai distinto correttamente obbligo e possibilità.",
        incorrect: "“Deve” richiede un comportamento; “può” indica una possibilità.",
        uncertain: "Confrontiamo “deve fermarsi” e “può proseguire”."
      }
    },
    {
      id: "segnale-pericolo-forma-a",
      version: 1,
      kind: "concept-check",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["segnali-pericolo"],
      conceptIds: ["segnale-pericolo"],
      languageFeatureIds: [],
      prerequisiteConceptIds: [],
      difficulty: 1,
      transferGroupId: "segnali-pericolo-funzione",
      visual: "danger-sign",
      prompt: "In generale, che cosa annuncia un segnale triangolare con bordo rosso?",
      simplifiedPrompt: "Il triangolo con bordo rosso avvisa di un pericolo.",
      segments: ["In generale", "che cosa annuncia", "un segnale triangolare con bordo rosso?"],
      glossary: [{ term: "annuncia", explanation: "Avvisa prima di incontrare una situazione." }],
      options: [
        { id: "danger", text: "Un pericolo da affrontare con prudenza" },
        { id: "obligation", text: "Un obbligo indicato dal colore blu" }
      ],
      correctOptionId: "danger",
      feedback: {
        correct: "Hai riconosciuto la funzione generale dei segnali di pericolo.",
        incorrect: "La forma triangolare con bordo rosso avvisa di un pericolo.",
        uncertain: "Osserva prima la forma e il bordo del segnale."
      }
    },
    {
      id: "linguaggio-negazione-a",
      version: 1,
      kind: "language-training",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["comportamento"],
      conceptIds: ["obbligo-possibilita"],
      languageFeatureIds: ["negazione", "verbi-modali"],
      prerequisiteConceptIds: [],
      difficulty: 1,
      transferGroupId: "negazioni-base",
      visual: "language",
      prompt: "La frase “Il veicolo non può proseguire” consente di andare avanti?",
      simplifiedPrompt: "“Non può proseguire” significa che non è consentito andare avanti.",
      segments: ["Il veicolo", "non può", "proseguire"],
      glossary: [{ term: "proseguire", explanation: "Continuare ad avanzare." }],
      options: [
        { id: "no", text: "No, non è consentito" },
        { id: "yes", text: "Sì, può andare avanti" }
      ],
      correctOptionId: "no",
      feedback: {
        correct: "Hai riconosciuto che “non” cambia il significato della frase.",
        incorrect: "La negazione “non” rende impossibile la possibilità espressa da “può”.",
        uncertain: "Leggi insieme le parole “non può”."
      }
    },
    {
      id: "linguaggio-eccezione-a",
      version: 1,
      kind: "language-training",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["comportamento"],
      conceptIds: [],
      languageFeatureIds: ["eccezione"],
      prerequisiteConceptIds: [],
      difficulty: 1,
      transferGroupId: "eccezioni-base",
      visual: "language",
      prompt: "Il divieto vale per tutti, salvo i residenti. Chi è escluso dal divieto?",
      simplifiedPrompt: "“Salvo i residenti” significa che il divieto non vale per i residenti.",
      segments: ["Il divieto vale per tutti", "salvo i residenti", "chi è escluso dal divieto?"],
      glossary: [{ term: "salvo", explanation: "Introduce un’eccezione: significa “tranne”." }],
      options: [
        { id: "residents", text: "I residenti" },
        { id: "everyone", text: "Tutte le persone" }
      ],
      correctOptionId: "residents",
      feedback: {
        correct: "Hai individuato l’eccezione introdotta da “salvo”.",
        incorrect: "Dopo “salvo” viene indicato chi non segue la regola generale.",
        uncertain: "Puoi sostituire “salvo” con “tranne”."
      }
    },
    {
      id: "linguaggio-assoluti-a",
      version: 1,
      kind: "language-training",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["comportamento"],
      conceptIds: [],
      languageFeatureIds: ["assoluti"],
      prerequisiteConceptIds: [],
      difficulty: 1,
      transferGroupId: "assoluti-base",
      visual: "language",
      prompt: "Nella frase “deve sempre fermarsi”, che cosa indica la parola “sempre”?",
      simplifiedPrompt: "“Sempre” significa in tutti i casi, senza eccezioni indicate.",
      segments: ["deve", "sempre", "fermarsi"],
      glossary: [{ term: "sempre", explanation: "In tutti i casi, senza eccezioni espresse." }],
      options: [
        { id: "all-cases", text: "In tutti i casi" },
        { id: "sometimes", text: "Solo qualche volta" }
      ],
      correctOptionId: "all-cases",
      feedback: {
        correct: "Hai riconosciuto una parola assoluta.",
        incorrect: "“Sempre” estende l’affermazione a tutti i casi.",
        uncertain: "Confronta “sempre” con “qualche volta”."
      }
    },
    {
      id: "linguaggio-fermata-sosta-a",
      version: 1,
      kind: "language-training",
      origin: "editorial",
      reviewStatus: "published",
      topicIds: ["comportamento"],
      conceptIds: [],
      languageFeatureIds: ["termini-confondibili"],
      prerequisiteConceptIds: [],
      difficulty: 1,
      transferGroupId: "fermata-sosta-base",
      visual: "language",
      prompt: "Quale situazione descrive meglio una fermata breve?",
      simplifiedPrompt: "La fermata dura poco, per esempio per far salire o scendere una persona.",
      segments: ["Quale situazione", "descrive meglio", "una fermata breve?"],
      glossary: [
        { term: "fermata", explanation: "Sospensione breve della marcia, con conducente pronto a ripartire." },
        { term: "sosta", explanation: "Sospensione più lunga, durante la quale il conducente può allontanarsi." }
      ],
      options: [
        { id: "passenger", text: "Far salire una persona restando pronti a ripartire" },
        { id: "leave", text: "Lasciare il veicolo e allontanarsi a lungo" }
      ],
      correctOptionId: "passenger",
      feedback: {
        correct: "Hai distinto la fermata breve dalla sosta.",
        incorrect: "Durante la fermata il conducente resta pronto a riprendere la marcia.",
        uncertain: "Controlla se il conducente resta vicino e pronto a ripartire."
      }
    }
  ],
  lessons: [
    {
      id: "microlezione-precedenze",
      topicId: "precedenze",
      title: "Le precedenze agli incroci",
      headline: "Chi passa per primo a un incrocio?",
      introduction: "Impara a riconoscere chi ha la precedenza quando non ci sono semafori né segnali.",
      objective: "Guardare da dove arrivano i veicoli e applicare la regola della destra.",
      ruleTitle: "Guarda alla tua destra.",
      ruleExplanation: "Quando a un incrocio non ci sono segnali, devi dare la precedenza al veicolo che arriva dalla tua destra.",
      simpleExplanation: "Se qualcuno arriva da destra, lo lasci passare prima.",
      visual: "crossroad-right",
      guidedTitle: "Sei nell’auto verde.",
      guidedDescription: "L’auto arancione arriva dalla tua destra. Seguiamo due passaggi.",
      guidedSteps: [
        { title: "Da dove arriva l’altra auto?", explanation: "Arriva dalla tua destra.", emphasis: "destra" },
        { title: "Quale regola usiamo?", explanation: "Chi arriva da destra passa per primo.", emphasis: "per primo" }
      ],
      guidedOutcome: "Passa prima l’auto arancione.",
      guidedOutcomeDetail: "Tu rallenti e le dai la precedenza.",
      officialTextIntroduction: "Nei quiz ministeriali la stessa regola può essere formulata in modo più sintetico. Questo pacchetto contiene solo esercizi didattici redazionali: una domanda ufficiale verrà mostrata soltanto dopo la verifica di fonte e licenza."
    },
    {
      id: "microlezione-segnali-pericolo",
      topicId: "segnali-pericolo",
      title: "I segnali di pericolo",
      headline: "La forma anticipa il messaggio.",
      introduction: "Impara a riconoscere la funzione generale di un segnale prima di leggerne il simbolo.",
      objective: "Collegare la forma triangolare con bordo rosso alla presenza di un pericolo.",
      ruleTitle: "Prima osserva la forma.",
      ruleExplanation: "Un segnale triangolare con bordo rosso avvisa in generale di un pericolo e richiede prudenza.",
      simpleExplanation: "Triangolo con bordo rosso: attenzione, c’è un pericolo.",
      visual: "danger-sign",
      guidedTitle: "Riconosciamo gli indizi visivi.",
      guidedDescription: "Non serve ancora conoscere il simbolo interno: partiamo dalla forma e dal bordo.",
      guidedSteps: [
        { title: "Qual è la forma?", explanation: "Il segnale è triangolare.", emphasis: "triangolare" },
        { title: "Com’è il bordo?", explanation: "Il bordo rosso richiama l’attenzione.", emphasis: "rosso" }
      ],
      guidedOutcome: "Il segnale annuncia un pericolo.",
      guidedOutcomeDetail: "Rallenta e osserva il simbolo per capire quale pericolo incontrerai.",
      officialTextIntroduction: "Questa spiegazione riguarda la funzione generale della categoria. Le singole domande ufficiali saranno aggiunte solo con fonte e versione verificate."
    },
    {
      id: "microlezione-verbi-modali",
      topicId: "comportamento",
      title: "Può oppure deve?",
      headline: "Una parola cambia la regola.",
      introduction: "Allenati a distinguere una possibilità da un comportamento obbligatorio.",
      objective: "Riconoscere se una frase permette un comportamento oppure lo rende obbligatorio.",
      ruleTitle: "Osserva il verbo.",
      ruleExplanation: "“Deve” esprime un obbligo. “Può” indica una possibilità, un permesso o una facoltà.",
      simpleExplanation: "Deve significa obbligo; può significa possibilità.",
      visual: "language",
      guidedTitle: "Confrontiamo due frasi.",
      guidedDescription: "Le frasi sembrano simili, ma indicano comportamenti diversi.",
      guidedSteps: [
        { title: "Il conducente deve fermarsi", explanation: "Fermarsi è obbligatorio.", emphasis: "deve" },
        { title: "Il conducente può proseguire", explanation: "Proseguire è consentito, se è sicuro.", emphasis: "può" }
      ],
      guidedOutcome: "Prima individua “può” o “deve”.",
      guidedOutcomeDetail: "Poi scegli se la frase esprime una possibilità oppure un obbligo.",
      officialTextIntroduction: "Il tutor semplifica e scompone soltanto esercizi didattici redazionali. La parafrasi è un aiuto non ufficiale e non sostituisce il testo ministeriale."
    },
    {
      id: "microlezione-negazioni",
      topicId: "comportamento",
      title: "Le negazioni",
      headline: "Leggi insieme “non” e il verbo.",
      introduction: "Una negazione può capovolgere il significato di una frase apparentemente semplice.",
      objective: "Individuare “non” o “mai” prima di scegliere la risposta.",
      ruleTitle: "Cerca la negazione.",
      ruleExplanation: "Le parole “non” e “mai” modificano il verbo: vanno lette insieme all’azione a cui si riferiscono.",
      simpleExplanation: "Prima trova “non”; poi rileggi il verbo con la negazione.",
      visual: "language",
      guidedTitle: "Scomponiamo una frase.",
      guidedDescription: "Partiamo dal verbo e controlliamo se è preceduto da una negazione.",
      guidedSteps: [
        { title: "Qual è l’azione?", explanation: "L’azione è proseguire.", emphasis: "proseguire" },
        { title: "C’è una negazione?", explanation: "“Non può” nega la possibilità.", emphasis: "Non" }
      ],
      guidedOutcome: "Il veicolo non è autorizzato a proseguire.",
      guidedOutcomeDetail: "La negazione cambia il significato di “può”.",
      officialTextIntroduction: "La scomposizione è una spiegazione didattica non ufficiale. Il testo originale, quando disponibile e verificato, resterà sempre visibile e immutato."
    },
    {
      id: "microlezione-eccezioni",
      topicId: "comportamento",
      title: "Le eccezioni",
      headline: "“Salvo” introduce chi fa eccezione.",
      introduction: "Impara a separare la regola generale dal gruppo che non vi rientra.",
      objective: "Riconoscere le eccezioni introdotte da “salvo”, “tranne” o “eccetto”.",
      ruleTitle: "Trova la regola e poi l’eccezione.",
      ruleExplanation: "Parole come “salvo”, “tranne” ed “eccetto” indicano che una parte della frase non segue la regola generale.",
      simpleExplanation: "Dopo “salvo” trovi chi è escluso dalla regola.",
      visual: "language",
      guidedTitle: "Dividiamo la regola dall’eccezione.",
      guidedDescription: "La prima parte vale in generale; la seconda restringe il significato.",
      guidedSteps: [
        { title: "Qual è la regola generale?", explanation: "Il divieto vale per tutti.", emphasis: "tutti" },
        { title: "Chi fa eccezione?", explanation: "Dopo “salvo” troviamo i residenti.", emphasis: "residenti" }
      ],
      guidedOutcome: "I residenti sono esclusi dal divieto.",
      guidedOutcomeDetail: "Per gli altri resta valida la regola generale.",
      officialTextIntroduction: "La parafrasi aiuta a comprendere la struttura, ma non modifica né sostituisce un eventuale testo ufficiale verificato."
    },
    {
      id: "microlezione-assoluti",
      topicId: "comportamento",
      title: "Le parole assolute",
      headline: "“Sempre” non significa “qualche volta”.",
      introduction: "Le parole assolute estendono una frase a tutti i casi indicati.",
      objective: "Riconoscere parole come “sempre”, “mai”, “solo” e “in ogni caso”.",
      ruleTitle: "Dai peso alle parole assolute.",
      ruleExplanation: "“Sempre” e “in ogni caso” non ammettono eccezioni espresse; “solo” limita invece l’affermazione a un caso preciso.",
      simpleExplanation: "Sempre significa tutte le volte; solo limita a un caso.",
      visual: "language",
      guidedTitle: "Confrontiamo due frequenze.",
      guidedDescription: "Una parola può rendere l’affermazione generale oppure occasionale.",
      guidedSteps: [
        { title: "“Sempre”", explanation: "L’azione vale in tutti i casi.", emphasis: "tutti" },
        { title: "“Qualche volta”", explanation: "L’azione vale soltanto in alcuni casi.", emphasis: "alcuni" }
      ],
      guidedOutcome: "Controlla sempre l’estensione della frase.",
      guidedOutcomeDetail: "Una parola assoluta può essere decisiva per la risposta.",
      officialTextIntroduction: "L’evidenziazione è un supporto di studio. Nelle future prove fedeli il testo ufficiale sarà presentato senza aiuti."
    },
    {
      id: "microlezione-fermata-sosta",
      topicId: "comportamento",
      title: "Fermata e sosta",
      headline: "Due parole vicine, due situazioni diverse.",
      introduction: "Distingui una sospensione breve della marcia da un arresto più prolungato.",
      objective: "Riconoscere fermata e sosta dal comportamento del conducente.",
      ruleTitle: "Osserva durata e presenza del conducente.",
      ruleExplanation: "La fermata è breve e il conducente resta pronto a ripartire; durante la sosta può allontanarsi dal veicolo.",
      simpleExplanation: "Fermata: breve e pronti a ripartire. Sosta: più lunga e ci si può allontanare.",
      visual: "language",
      guidedTitle: "Confrontiamo le due situazioni.",
      guidedDescription: "Il tempo e la posizione del conducente aiutano a scegliere il termine corretto.",
      guidedSteps: [
        { title: "Fermata", explanation: "Il conducente resta pronto a ripartire.", emphasis: "pronto" },
        { title: "Sosta", explanation: "Il conducente può allontanarsi dal veicolo.", emphasis: "allontanarsi" }
      ],
      guidedOutcome: "Non usare i due termini come sinonimi.",
      guidedOutcomeDetail: "Controlla sempre che cosa fa il conducente.",
      officialTextIntroduction: "Le definizioni sono spiegazioni didattiche redazionali. Le formulazioni ufficiali saranno aggiunte solo dopo revisione della fonte."
    }
  ],
  activities: [
    {
      id: "lezione-precedenze-base",
      completionId: "precedenze-base",
      lessonId: "microlezione-precedenze",
      exerciseId: "precedenza-destra-visuale-b",
      type: "lesson",
      title: "Le precedenze agli incroci",
      description: "Comprendi la regola della destra con una situazione visiva.",
      route: "/lezione/precedenze",
      estimatedMinutes: 7,
      planOrder: 1,
      suggestedDayOffset: 0,
      conceptIds: ["precedenza-destra", "incrocio-senza-segnali"],
      languageFeatureIds: [],
      prerequisiteConceptIds: [],
      available: true
    },
    {
      id: "ripasso-precedenze-base",
      completionId: "ripasso-precedenze-base",
      lessonId: "microlezione-precedenze",
      exerciseId: "precedenza-destra-visuale-c",
      type: "review",
      title: "Ripassa la precedenza a destra",
      description: "Applica la regola a un caso diverso da quello appena studiato.",
      route: "/lezione/precedenze?modalita=ripasso",
      estimatedMinutes: 4,
      planOrder: 2,
      suggestedDayOffset: 1,
      conceptIds: ["precedenza-destra"],
      languageFeatureIds: [],
      prerequisiteConceptIds: ["precedenza-destra"],
      available: true
    },
    {
      id: "lezione-segnali-pericolo",
      completionId: "segnali-pericolo-base",
      lessonId: "microlezione-segnali-pericolo",
      exerciseId: "segnale-pericolo-forma-a",
      type: "lesson",
      title: "Riconosci i segnali di pericolo",
      description: "Usa forma e bordo per capire la funzione generale del segnale.",
      route: "/lezione/segnali-pericolo",
      estimatedMinutes: 6,
      planOrder: 3,
      suggestedDayOffset: 2,
      conceptIds: ["segnale-pericolo"],
      languageFeatureIds: [],
      prerequisiteConceptIds: [],
      available: true
    },
    {
      id: "linguaggio-verbi-modali",
      completionId: "linguaggio-verbi-modali",
      lessonId: "microlezione-verbi-modali",
      exerciseId: "linguaggio-puo-deve-a",
      type: "language",
      title: "“Può” oppure “deve”?",
      description: "Allenati a distinguere una possibilità da un obbligo.",
      route: "/allenamento-linguistico/verbi-modali",
      estimatedMinutes: 3,
      planOrder: 4,
      suggestedDayOffset: 3,
      conceptIds: ["obbligo-possibilita"],
      languageFeatureIds: ["verbi-modali"],
      prerequisiteConceptIds: [],
      available: true
    },
    {
      id: "linguaggio-negazioni",
      completionId: "linguaggio-negazioni",
      lessonId: "microlezione-negazioni",
      exerciseId: "linguaggio-negazione-a",
      type: "language",
      title: "Trova la negazione",
      description: "Leggi “non” e “mai” insieme al verbo che modificano.",
      route: "/allenamento-linguistico/negazioni",
      estimatedMinutes: 4,
      planOrder: 5,
      suggestedDayOffset: 4,
      conceptIds: ["obbligo-possibilita"],
      languageFeatureIds: ["negazione", "verbi-modali"],
      prerequisiteConceptIds: [],
      available: true
    },
    {
      id: "linguaggio-eccezioni",
      completionId: "linguaggio-eccezioni",
      lessonId: "microlezione-eccezioni",
      exerciseId: "linguaggio-eccezione-a",
      type: "language",
      title: "Riconosci le eccezioni",
      description: "Separa la regola generale da ciò che segue “salvo” o “eccetto”.",
      route: "/allenamento-linguistico/eccezioni",
      estimatedMinutes: 4,
      planOrder: 6,
      suggestedDayOffset: 5,
      conceptIds: [],
      languageFeatureIds: ["eccezione"],
      prerequisiteConceptIds: [],
      available: true
    },
    {
      id: "linguaggio-assoluti",
      completionId: "linguaggio-assoluti",
      lessonId: "microlezione-assoluti",
      exerciseId: "linguaggio-assoluti-a",
      type: "language",
      title: "Individua le parole assolute",
      description: "Distingui “sempre” e “solo” dalle espressioni non assolute.",
      route: "/allenamento-linguistico/parole-assolute",
      estimatedMinutes: 4,
      planOrder: 7,
      suggestedDayOffset: 6,
      conceptIds: [],
      languageFeatureIds: ["assoluti"],
      prerequisiteConceptIds: [],
      available: true
    },
    {
      id: "linguaggio-fermata-sosta",
      completionId: "linguaggio-fermata-sosta",
      lessonId: "microlezione-fermata-sosta",
      exerciseId: "linguaggio-fermata-sosta-a",
      type: "language",
      title: "Distingui fermata e sosta",
      description: "Usa durata e comportamento del conducente per scegliere il termine corretto.",
      route: "/allenamento-linguistico/fermata-sosta",
      estimatedMinutes: 5,
      planOrder: 8,
      suggestedDayOffset: 7,
      conceptIds: [],
      languageFeatureIds: ["termini-confondibili"],
      prerequisiteConceptIds: [],
      available: true
    }
  ]
};
