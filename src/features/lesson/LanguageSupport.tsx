import { BookOpenText, Lightbulb, ListTree, WandSparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { ExerciseDefinition } from "../../content/catalog/types";
import styles from "../../styles/App.module.scss";

const RELEVANT_WORDS = /\b(non|mai|salvo|tranne|eccetto|sempre|solo|può|deve|se|quando)\b/gi;
const RELEVANT_WORD = /^(non|mai|salvo|tranne|eccetto|sempre|solo|può|deve|se|quando)$/i;

function highlightLanguage(text: string): ReactNode[] {
  return text.split(RELEVANT_WORDS).map((part, index) =>
    RELEVANT_WORD.test(part)
      ? <mark key={`${part}-${index}`}>{part}</mark>
      : part
  );
}

export function LanguageSupport({
  exercise,
  onUseHelp
}: {
  exercise: ExerciseDefinition;
  onUseHelp: () => void;
}) {
  const [showSegments, setShowSegments] = useState(false);
  const [showSimplification, setShowSimplification] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function toggle(
    active: boolean,
    update: (next: boolean) => void
  ) {
    if (!active) onUseHelp();
    update(!active);
  }

  return (
    <section className={styles.languageSupport} aria-label="Aiuti per comprendere la frase">
      <div className={styles.languageSupportActions}>
        <button
          type="button"
          aria-pressed={showHint}
          onClick={() => toggle(showHint, setShowHint)}
        >
          <Lightbulb aria-hidden="true" /> Mostra un indizio
        </button>
        {exercise.segments?.length ? (
          <button
            type="button"
            aria-pressed={showSegments}
            onClick={() => toggle(showSegments, setShowSegments)}
          >
            <ListTree aria-hidden="true" /> Scomponi la frase
          </button>
        ) : null}
        {exercise.simplifiedPrompt ? (
          <button
            type="button"
            aria-pressed={showSimplification}
            onClick={() => toggle(showSimplification, setShowSimplification)}
          >
            <WandSparkles aria-hidden="true" /> Semplifica
          </button>
        ) : null}
        {exercise.glossary?.length ? (
          <button
            type="button"
            aria-pressed={showGlossary}
            onClick={() => toggle(showGlossary, setShowGlossary)}
          >
            <BookOpenText aria-hidden="true" /> Glossario
          </button>
        ) : null}
      </div>

      {showHint ? (
        <div className={styles.lessonHint} role="note">
          <strong>Indizio</strong>
          <p>{exercise.feedback.uncertain}</p>
        </div>
      ) : null}

      {showSegments ? (
        <div className={styles.segmentedPrompt} role="note">
          <strong>Frase divisa in parti</strong>
          <ol>
            {exercise.segments?.map((segment) => (
              <li key={segment}>{highlightLanguage(segment)}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {showSimplification ? (
        <div className={styles.simplifiedPrompt} role="note">
          <strong>Spiegazione didattica non ufficiale</strong>
          <p>{exercise.simplifiedPrompt}</p>
        </div>
      ) : null}

      {showGlossary ? (
        <dl className={styles.lessonGlossary}>
          {exercise.glossary?.map((entry) => (
            <div key={entry.term}>
              <dt>{entry.term}</dt>
              <dd>{entry.explanation}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
