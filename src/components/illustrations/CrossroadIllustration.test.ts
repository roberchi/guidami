import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CrossroadIllustration } from "./CrossroadIllustration";
import { vehicleLanePositions } from "./crossroadGeometry";

describe("CrossroadIllustration", () => {
  it("colloca entrambi i veicoli nella corsia destra rispetto al loro senso di marcia", () => {
    expect(vehicleLanePositions.green.x).toBeGreaterThan(220);
    expect(vehicleLanePositions.green.x).toBeLessThan(262);

    expect(vehicleLanePositions.right.x).toBeGreaterThan(262);
    expect(vehicleLanePositions.right.y).toBeGreaterThan(91);
    expect(vehicleLanePositions.right.y).toBeLessThan(129);

    expect(vehicleLanePositions.left.x).toBeLessThan(178);
    expect(vehicleLanePositions.left.y).toBeGreaterThan(129);
    expect(vehicleLanePositions.left.y).toBeLessThan(174);
  });

  it("mostra la variante blu a sinistra con testo e posizione coerenti", () => {
    const markup = renderToStaticMarkup(createElement(CrossroadIllustration, { otherVehicleSide: "left" }));

    expect(markup).toContain("auto blu arriva dalla sua sinistra");
    expect(markup).toContain("translate(96 151) rotate(0)");
    expect(markup).toContain("Sinistra");
    expect(markup).not.toContain("Destra");
  });
});
