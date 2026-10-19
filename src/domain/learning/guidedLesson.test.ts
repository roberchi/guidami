import { describe, expect, it } from "vitest";
import { contentCatalog } from "../../content/catalog/catalog";
import { buildLearningAttempt, isGuidedActivityAccessible, resolveGuidedActivity } from "./guidedLesson";

describe("motore delle microlezioni", () => {
  it("risolve contenuto ed esercizio dal catalogo", () => {
    const resolved = resolveGuidedActivity(contentCatalog, "linguaggio-verbi-modali");

    expect(resolved?.lesson.id).toBe("microlezione-verbi-modali");
    expect(resolved?.exercise.id).toBe("linguaggio-puo-deve-a");
  });

  it("registra una risposta con aiuto come assistita", () => {
    const resolved = resolveGuidedActivity(contentCatalog, "linguaggio-verbi-modali");
    if (!resolved) throw new Error("Attività di prova non disponibile");

    const attempt = buildLearningAttempt({
      id: "attempt-assisted",
      occurredAt: "2026-10-19T10:00:00.000Z",
      answer: {
        activityId: resolved.activity.id,
        exerciseId: resolved.exercise.id,
        selectedOptionId: resolved.exercise.correctOptionId,
        usedHelp: true
      },
      resolved,
      previousAttempts: []
    });

    expect(attempt).toMatchObject({ correct: true, independent: false, usedHelp: true, novelVariant: true });
  });

  it("mantiene autonoma una risposta senza supporti e riconosce una variante già vista", () => {
    const resolved = resolveGuidedActivity(contentCatalog, "lezione-precedenze-base");
    if (!resolved) throw new Error("Attività di prova non disponibile");

    const attempt = buildLearningAttempt({
      id: "attempt-independent",
      occurredAt: "2026-10-19T10:00:00.000Z",
      answer: {
        activityId: resolved.activity.id,
        exerciseId: resolved.exercise.id,
        selectedOptionId: resolved.exercise.correctOptionId,
        usedHelp: false
      },
      resolved,
      previousAttempts: [{
        id: "previous",
        activityId: resolved.activity.id,
        exerciseId: resolved.exercise.id,
        occurredAt: "2026-10-18T10:00:00.000Z",
        conceptIds: resolved.exercise.conceptIds,
        languageFeatureIds: resolved.exercise.languageFeatureIds,
        correct: true,
        independent: true,
        usedHelp: false,
        novelVariant: true
      }]
    });

    expect(attempt).toMatchObject({ correct: true, independent: true, usedHelp: false, novelVariant: false });
  });

  it("impedisce di registrare un’attività saltando quelle precedenti", () => {
    expect(isGuidedActivityAccessible(contentCatalog, "linguaggio-verbi-modali", [])).toBe(false);
    expect(isGuidedActivityAccessible(
      contentCatalog,
      "linguaggio-verbi-modali",
      ["precedenze-base", "ripasso-precedenze-base", "segnali-pericolo-base"]
    )).toBe(true);
  });
});
