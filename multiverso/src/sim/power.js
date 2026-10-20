import { PANEL } from "../data/catalog";

// A luz do Sol diminui com o quadrado da distância (lei do inverso do quadrado)
export function solarFlux(distanceAU) {
  return 1361 / distanceAU ** 2; // W/m² (1361 é o valor à distância da Terra)
}

// Potência média dos painéis ao longo de um ciclo dia/noite
export function solarPowerW({ distanceAU, areaM2, incidence, sunFraction }) {
  return (
    solarFlux(distanceAU) * areaM2 * PANEL.efficiency * PANEL.derate * incidence * sunFraction
  );
}