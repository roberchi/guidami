import { describe, expect, it } from "vitest";
import { contentCatalog } from "../../content/catalog/catalog";
import { buildIndicativePlan } from "./buildIndicativePlan";

describe("piano di massima", () => {
  it("rende disponibile solo la prima attività non completata", () => {
    const plan = buildIndicativePlan({
      catalog: contentCatalog,
      completedActivityIds: [],
      startAt: "2026-10-18T10:00:00.000Z",
      now: "2026-10-18T12:00:00.000Z"
    });

    expect(plan.items[0]).toMatchObject({
      activityId: "lezione-precedenze-base",
      status: "available"
    });
    expect(plan.items.slice(1).every((item) => item.status === "locked")).toBe(true);
  });

  it("sblocca in anticipo il passo successivo senza rendere vincolante il giorno", () => {
    const plan = buildIndicativePlan({
      catalog: contentCatalog,
      completedActivityIds: ["precedenze-base"],
      startAt: "2026-10-18T10:00:00.000Z",
      now: "2026-10-18T12:00:00.000Z"
    });

    expect(plan.items[1]).toMatchObject({
      activityId: "ripasso-precedenze-base",
      status: "available",
      startsEarly: true,
      plannedFor: "2026-10-19T10:00:00.000Z"
    });
  });

  it("mantiene bloccati tutti i passi dopo il primo non completato", () => {
    const catalog = structuredClone(contentCatalog);
    catalog.activities[1].suggestedDayOffset = 10;
    catalog.activities[2].suggestedDayOffset = 0;
    const plan = buildIndicativePlan({
      catalog,
      completedActivityIds: ["precedenze-base"],
      startAt: "2026-10-18T10:00:00.000Z",
      now: "2026-10-18T12:00:00.000Z"
    });

    expect(plan.items.map((item) => item.status)).toEqual([
      "completed",
      "available",
      ...Array.from({ length: plan.items.length - 2 }, () => "locked")
    ]);
  });
});
