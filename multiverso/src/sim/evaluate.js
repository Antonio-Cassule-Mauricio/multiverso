import {
  ISP, PANEL, BATTERY, RTG, COMMS, INTEGRATION_COST_PER_KG_M,
  missionTypes, instruments, launchers, antennas,
} from "../data/catalog";
import { universes } from "../data/universes";
import { propellantNeeded } from "./rocket";
import { solarPowerW } from "./power";
import { dataRateBps, commsElectricW } from "./comms";

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0);

export function evaluateMission(mission) {
  const universe = universes[mission.universe];
  const type = missionTypes[mission.type];
  const env = universe.types[mission.type];
  const launcher = launchers[mission.launcher];
  const antenna = antennas[mission.comms.antenna];
  const chosen = mission.instruments.map((id) => ({ id, ...instruments[id] }));
  const solar = mission.power.source === "solar";
  const { panelArea, batteryKg } = mission.power;
  const txPower = mission.comms.txPower;

  // ---------- MASSA ----------
  const dryMass =
    type.busMassKg +
    sum(chosen, "massKg") +
    (solar ? panelArea * PANEL.kgPerM2 : RTG.massKg) +
    batteryKg +
    antenna.massKg +
    txPower * COMMS.kgPerW;
  const edlMass = dryMass * env.edlFactor; // escudo térmico, paraquedas, etc.
  const massAfterBurn = dryMass + edlMass;
  const propellant = propellantNeeded(massAfterBurn, env.dvMs, ISP);
  const launchMass = massAfterBurn + propellant;
  const capacity = launcher.capacityKg[mission.universe];

  // ---------- ENERGIA ----------
  const consumptionW = type.busPowerW + sum(chosen, "powerW") + commsElectricW(txPower);
  const generationW = solar
    ? solarPowerW({
        distanceAU: universe.sunDistanceAU,
        areaM2: panelArea,
        incidence: env.incidence,
        sunFraction: env.sunFraction,
      })
    : RTG.powerW;
  const darkHours = solar ? env.cycleHours * (1 - env.sunFraction) : 0;
  const neededWh = consumptionW * darkHours;
  const batteryWh = batteryKg * BATTERY.whPerKg * BATTERY.usableFraction;

  // ---------- COMUNICAÇÕES ----------
  const rateBps = dataRateBps(txPower, antenna.diameterM, universe.earthDistanceAU);
  const downlinkMbit = (rateBps * env.contactHours * 3600) / 1e6;
  const producedMbit = sum(chosen, "dataMbitDay");
  const returnFraction = producedMbit === 0 ? 0 : Math.min(1, downlinkMbit / producedMbit);

  // ---------- CUSTO ----------
  const cost = {
    bus: type.busCostM,
    instruments: sum(chosen, "costM"),
    power:
      (solar ? panelArea * PANEL.costPerM2M : RTG.costM) + batteryKg * BATTERY.costPerKgM,
    comms: antenna.costM + txPower * COMMS.costPerWM,
    launcher: launcher.costM,
    integration: dryMass * INTEGRATION_COST_PER_KG_M,
  };
  const totalCost = Object.values(cost).reduce((a, b) => a + b, 0);

  // ---------- CIÊNCIA E RISCO ----------
  const rawScience = sum(chosen, "science");
  const returnedScience = rawScience * returnFraction;
  const successProbability =
    launcher.reliability * (1 - env.risk) * (1 - 0.01 * chosen.length);

  // ---------- VERIFICAÇÃO ----------
  const checks = [];
  const add = (id, status, message) => checks.push({ id, status, message });

  const incompatible = chosen.filter((i) => !i.worksOn.includes(mission.type));
  if (incompatible.length > 0) {
    add("instruments", "error",
      `Instrumentos incompatíveis com ${type.name}: ${incompatible.map((i) => i.name).join(", ")}.`);
  } else if (chosen.length === 0) {
    add("instruments", "error", "A missão não tem instrumentos científicos.");
  } else {
    add("instruments", "ok", "Instrumentos compatíveis com o tipo de missão.");
  }

  if (launchMass > capacity) {
    add("mass", "error",
      `Massa a mais: ${launchMass.toFixed(0)} kg para um lançador que leva ${capacity} kg.`);
  } else {
    add("mass", "ok", `Massa OK: ${launchMass.toFixed(0)} de ${capacity} kg.`);
  }

  if (generationW < consumptionW) {
    add("power", "error",
      `Energia insuficiente: produz ${generationW.toFixed(0)} W e precisa de ${consumptionW.toFixed(0)} W.`);
  } else {
    add("power", "ok",
      `Energia OK: produz ${generationW.toFixed(0)} W, consome ${consumptionW.toFixed(0)} W.`);
  }

  if (batteryWh < neededWh) {
    add("battery", "error",
      `Bateria fraca: tem ${batteryWh.toFixed(0)} Wh e precisa de ${neededWh.toFixed(0)} Wh para a noite/eclipse.`);
  } else {
    add("battery", "ok", "Bateria suficiente para a noite/eclipse.");
  }

  if (returnFraction < 0.5) {
    add("comms", "warning",
      `Só ${(returnFraction * 100).toFixed(0)}% dos dados chegam à Terra. Antena ou potência limitam a ciência.`);
  } else {
    add("comms", "ok", `Comunicações OK: ${(returnFraction * 100).toFixed(0)}% dos dados chegam à Terra.`);
  }

  if (totalCost > universe.budgetM) {
    add("cost", "error",
      `Orçamento ultrapassado: ${totalCost.toFixed(0)} M$ de ${universe.budgetM} M$.`);
  } else {
    add("cost", "ok", `Custo OK: ${totalCost.toFixed(0)} de ${universe.budgetM} M$.`);
  }

  return {
    universeName: universe.name,
    typeName: type.name,
    mass: { dry: dryMass, edl: edlMass, propellant, launch: launchMass, capacity },
    power: { consumptionW, generationW, batteryWh, neededWh },
    comms: { rateBps, downlinkMbit, producedMbit, returnFraction },
    cost: { ...cost, total: totalCost, budget: universe.budgetM },
    science: { raw: rawScience, returned: returnedScience },
    successProbability,
    checks,
    ok: checks.every((c) => c.status !== "error"),
  };
}