// Constantes físicas e de engenharia (simplificadas, para o jogo)
export const G0 = 9.80665; // gravidade padrão (m/s²), usada na equação do foguetão
export const ISP = 320; // impulso específico do motor da sonda (s), bipropelente
export const PANEL = { kgPerM2: 6, costPerM2M: 0.5, efficiency: 0.28, derate: 0.8 };
export const BATTERY = { whPerKg: 150, usableFraction: 0.8, costPerKgM: 0.2 };
export const RTG = { massKg: 45, powerW: 110, costM: 120 };
export const COMMS = {
  k: 2500, // calibrado: 100 W + antena de 3 m a 1,5 UA dá ~1 Mbps
  amplifierEfficiency: 0.3,
  txDuty: 0.25, // fração do tempo em que o transmissor está ligado
  kgPerW: 0.05,
  costPerWM: 0.05,
};
export const INTEGRATION_COST_PER_KG_M = 0.03;

// Tipos de missão (costM = milhões de dólares)
export const missionTypes = {
  orbiter: { name: "Orbitador", busMassKg: 300, busPowerW: 150, busCostM: 150 },
  lander: { name: "Lander", busMassKg: 250, busPowerW: 100, busCostM: 200 },
  rover: { name: "Rover", busMassKg: 450, busPowerW: 120, busCostM: 350 },
};

// Instrumentos científicos
export const instruments = {
  camera: {
    name: "Câmara de alta resolução",
    massKg: 8, powerW: 15, costM: 12, dataMbitDay: 2000, science: 20,
    worksOn: ["orbiter", "lander", "rover"],
  },
  spectrometer: {
    name: "Espectrómetro",
    massKg: 12, powerW: 25, costM: 25, dataMbitDay: 500, science: 35,
    worksOn: ["orbiter", "lander", "rover"],
  },
  radar: {
    name: "Radar de subsolo",
    massKg: 40, powerW: 60, costM: 60, dataMbitDay: 800, science: 40,
    worksOn: ["orbiter"],
  },
  drillLab: {
    name: "Broca e laboratório",
    massKg: 45, powerW: 80, costM: 110, dataMbitDay: 100, science: 60,
    worksOn: ["lander", "rover"],
  },
  weather: {
    name: "Estação meteorológica",
    massKg: 3, powerW: 5, costM: 6, dataMbitDay: 10, science: 10,
    worksOn: ["orbiter", "lander", "rover"],
  },
  seismometer: {
    name: "Sismómetro",
    massKg: 20, powerW: 10, costM: 40, dataMbitDay: 50, science: 30,
    worksOn: ["lander", "rover"],
  },
};

// Lançadores: capacidade (kg) enviada para cada universo
export const launchers = {
  small: { name: "Pequeno", costM: 25, reliability: 0.92, capacityKg: { mars: 400 } },
  medium: { name: "Médio", costM: 90, reliability: 0.96, capacityKg: { mars: 1500 } },
  heavy: { name: "Pesado", costM: 150, reliability: 0.97, capacityKg: { mars: 4000 } },
};

// Antenas
export const antennas = {
  low: { name: "Ganho baixo", diameterM: 0.3, massKg: 3, costM: 2 },
  medium: { name: "Ganho médio", diameterM: 1.0, massKg: 10, costM: 8 },
  high: { name: "Ganho alto", diameterM: 2.5, massKg: 35, costM: 25 },
};