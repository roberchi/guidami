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
    }
  ],
  activities: [
    {
      id: "lezione-precedenze-base",
      type: "lesson",
      title: "Le precedenze agli incroci",
      description: "Comprendi la regola della destra con una situazione visiva.",
      route: "/lezione/precedenze",
      estimatedMinutes: 7,
      conceptIds: ["precedenza-destra", "incrocio-senza-segnali"],
      languageFeatureIds: [],
      prerequisiteConceptIds: [],
      available: true
    },
    {
      id: "ripasso-precedenze-base",
      type: "review",
      title: "Ripassa la precedenza a destra",
      description: "Applica la regola a un caso diverso da quello appena studiato.",
      route: "/lezione/precedenze?modalita=ripasso",
      estimatedMinutes: 4,
      conceptIds: ["precedenza-destra"],
      languageFeatureIds: [],
      prerequisiteConceptIds: ["precedenza-destra"],
      available: true
    },
    {
      id: "linguaggio-verbi-modali",
      type: "language",
      title: "“Può” oppure “deve”?",
      description: "Allenati a distinguere una possibilità da un obbligo.",
      route: "/allenamento-linguistico/verbi-modali",
      estimatedMinutes: 3,
      conceptIds: ["obbligo-possibilita"],
      languageFeatureIds: ["verbi-modali"],
      prerequisiteConceptIds: [],
      available: false
    }
  ]
};
