import { describe, expect, it } from "vitest";
import { buildLearningProfile } from "./assessment";

describe("buildLearningProfile", () => {
  it("keeps knowledge and language observations descriptive", () => {
    const profile = buildLearningProfile({
      crossroad: "orange",
      negation: "forbidden",
      "must-may": "no"
    });

    expect(profile.level).toBe("building");
    expect(profile.strengths).toContain("Riconosci una precedenza in una situazione concreta");
    expect(profile.focusAreas).toContain("Frasi con negazioni come “non è vietato”");
  });

  it("uses da verificare when there is not enough evidence", () => {
    const profile = buildLearningProfile({ crossroad: "unknown" });
    expect(profile.confidence).toBe("da verificare");
    expect(profile.focusAreas.length).toBeGreaterThan(0);
  });
});
