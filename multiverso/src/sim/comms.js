import { COMMS } from "../data/catalog";

// Taxa de dados (bits/s). O ganho da antena cresce com o diâmetro²,
// e o sinal enfraquece com a distância²
export function dataRateBps(txPowerW, antennaDiameterM, distanceAU) {
  return (COMMS.k * txPowerW * antennaDiameterM ** 2) / distanceAU ** 2;
}

// Consumo elétrico médio do transmissor
export function commsElectricW(txPowerW) {
  return (txPowerW / COMMS.amplifierEfficiency) * COMMS.txDuty;
}