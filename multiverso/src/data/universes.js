export const universes = {
  mars: {
    id: "mars",
    name: "Marte",
    sunDistanceAU: 1.52, // distância ao Sol
    earthDistanceAU: 1.5, // distância média à Terra (simplificação)
    budgetM: 800, // orçamento em milhões de dólares
    types: {
      orbiter: {
        dvMs: 1500, edlFactor: 0, risk: 0.05,
        contactHours: 8, cycleHours: 2, sunFraction: 0.67, incidence: 1.0,
      },
      lander: {
        dvMs: 300, edlFactor: 1.0, risk: 0.2,
        contactHours: 4, cycleHours: 24.6, sunFraction: 0.5, incidence: 0.7,
      },
      rover: {
        dvMs: 300, edlFactor: 1.2, risk: 0.25,
        contactHours: 4, cycleHours: 24.6, sunFraction: 0.5, incidence: 0.7,
      },
    },
  },
};