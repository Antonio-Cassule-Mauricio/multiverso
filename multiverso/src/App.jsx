import { evaluateMission } from "./sim/evaluate";

// Missão de teste: um orbitador em Marte
const exampleMission = {
  universe: "mars",
  type: "orbiter",
  instruments: ["camera", "spectrometer", "radar"],
  power: { source: "solar", panelArea: 4, batteryKg: 3 },
  comms: { antenna: "medium", txPower: 35 },
  launcher: "medium",
};

const icons = { ok: "✅", warning: "⚠️", error: "❌" };

function App() {
  const r = evaluateMission(exampleMission);

  return (
    <main style={{ maxWidth: 700, margin: "5vh auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>🌌 Multiverso</h1>
      <p>Projeto NASA Space Apps 2026 · Universo: {r.universeName}</p>

      <h2>Missão de teste: {r.typeName}</h2>
      <ul>
        <li>Massa de lançamento: {r.mass.launch.toFixed(0)} kg (limite {r.mass.capacity} kg)</li>
        <li>Custo total: {r.cost.total.toFixed(0)} M$ (orçamento {r.cost.budget} M$)</li>
        <li>Ciência devolvida: {r.science.returned.toFixed(0)} de {r.science.raw} pontos</li>
        <li>Probabilidade de sucesso: {(r.successProbability * 100).toFixed(0)}%</li>
      </ul>

      <h3>Verificações</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {r.checks.map((c) => (
          <li key={c.id}>{icons[c.status]} {c.message}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;