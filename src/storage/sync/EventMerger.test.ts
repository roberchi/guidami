import { describe, expect, it } from "vitest";
import type { LearningEvent } from "../../domain/models";
import { EventCollisionError, mergeEvents } from "./EventMerger";

const base: LearningEvent = {
  id: "event-1",
  deviceId: "device-a",
  studentProfileId: "student-a",
  type: "lesson.completed",
  occurredAt: "2026-10-18T10:00:00.000Z",
  schemaVersion: 1,
  payload: { lessonId: "precedenze" }
};

describe("mergeEvents", () => {
  it("deduplicates retry copies by stable event id", () => {
    expect(mergeEvents([base], [{ ...base }])).toEqual([base]);
  });

  it("keeps concurrent events from separate devices", () => {
    const concurrent = { ...base, id: "event-2", deviceId: "device-b" };
    expect(mergeEvents([base], [concurrent])).toHaveLength(2);
  });

  it("refuses inconsistent collisions", () => {
    expect(() => mergeEvents([base], [{ ...base, type: "assessment.completed" }])).toThrow(EventCollisionError);
  });
});
