import { describe, expect, it } from "vitest";
import { vehicleLanePositions } from "./crossroadGeometry";

describe("CrossroadIllustration", () => {
  it("colloca entrambi i veicoli nella corsia destra rispetto al loro senso di marcia", () => {
    expect(vehicleLanePositions.green.x).toBeGreaterThan(220);
    expect(vehicleLanePositions.green.x).toBeLessThan(262);

    expect(vehicleLanePositions.orange.y).toBeGreaterThan(91);
    expect(vehicleLanePositions.orange.y).toBeLessThan(129);
  });
});
