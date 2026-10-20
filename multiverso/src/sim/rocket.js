import { G0 } from "../data/catalog";

// Equação de Tsiolkovsky: quanto Δv (m/s) o motor consegue dar
export function deltaV(isp, m0, m1) {
  return isp * G0 * Math.log(m0 / m1);
}

// Inversa: quanto propelente (kg) é preciso para um dado Δv
export function propellantNeeded(massAfterBurn, dv, isp) {
  return massAfterBurn * (Math.exp(dv / (isp * G0)) - 1);
}