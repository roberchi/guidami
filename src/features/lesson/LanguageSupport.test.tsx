// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contentCatalog } from "../../content/catalog/catalog";
import { LanguageSupport } from "./LanguageSupport";

let root: Root | undefined;
let container: HTMLDivElement | undefined;

function renderSupport(onUseHelp: () => void) {
  const exercise = contentCatalog.exercises.find((item) => item.id === "linguaggio-puo-deve-a");
  if (!exercise) throw new Error("Esercizio di prova non disponibile");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(<LanguageSupport exercise={exercise} onUseHelp={onUseHelp} />));
  return container;
}

function clickButton(rendered: HTMLElement, label: string) {
  const button = [...rendered.querySelectorAll("button")]
    .find((candidate) => candidate.textContent?.trim() === label);
  if (!button) throw new Error(`Pulsante non trovato: ${label}`);
  act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
}

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

describe("aiuti del tutor linguistico", () => {
  it("marca come aiuto la semplificazione e la distingue dal testo ufficiale", () => {
    const onUseHelp = vi.fn();
    const rendered = renderSupport(onUseHelp);

    clickButton(rendered, "Semplifica");

    expect(onUseHelp).toHaveBeenCalledOnce();
    expect(rendered.textContent).toContain("Spiegazione didattica non ufficiale");
    expect(rendered.textContent).toContain("“Deve” significa che è obbligatorio.");
  });

  it("scompone la frase ed evidenzia le parole linguisticamente rilevanti", () => {
    const rendered = renderSupport(() => undefined);

    clickButton(rendered, "Scomponi la frase");

    expect(rendered.textContent).toContain("Frase divisa in parti");
    expect(rendered.querySelector("mark")?.textContent).toBe("deve");
  });
});
