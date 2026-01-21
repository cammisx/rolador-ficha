import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const COLORS = ["#00eaff", "#ff00ff", "#00ff9c", "#ffd500", "#ff3b3b"];

export default function DiceRoller() {
  const [count, setCount] = useState(1);
  const [type, setType] = useState("d20");
  const [customSides, setCustomSides] = useState(6);
  const [dice, setDice] = useState([]);
  const [results, setResults] = useState(null);

  const addDice = () => {
    const sides = type === "outro" ? customSides : Number(type.slice(1));
    if (!sides || count <= 0) return;
    setDice([...dice, { count, sides }]);
  };

  const roll = () => {
    const rolled = dice.map((d) => ({
      ...d,
      values: Array.from({ length: d.count }, () =>
        Math.floor(Math.random() * d.sides) + 1
      ),
    }));
    setResults(rolled);
  };

  const reset = () => {
    setDice([]);
    setResults(null);
  };

  return (
  
  <div
    className="
      w-full
      h-full
      origin-top
      scale-75
      sm:scale-90
      md:scale-100
      lg:scale-125
      xl:scale-150
      2xl:scale-200
      transition-transform
      duration-300
    "
  style={{
    animation: "neonPulse 2.5s ease-in-out infinite, neonFlicker 6s infinite",
  }}
>

      <div className="bg-transparent border-4 border-cyan-400 rounded-2xl p-4 shadow-[0_0_30px_#00eaff]">
        <h1 className="text-center text-2xl tracking-widest text-cyan-300 mb-4">
          {results ? "RESULTADOS" : "ROLADOR DE DADOS"}
        </h1>

        {!results && (
          <>
            {/* CONTROLES */}
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <input
                type="number"
                min={1}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-16 bg-transparent border-2 border-cyan-400 rounded px-2 py-1 text-center"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-transparent border-2 border-cyan-400 rounded px-2 py-1"
              >
                <option value="d4">d4</option>
                <option value="d12">d12</option>
                <option value="d20">d20</option>
                <option value="d30">d30</option>
                <option value="outro">Outro</option>
              </select>

              {type === "outro" && (
                <div className="flex items-center gap-1">
                  <span>d</span>
                  <input
                    type="number"
                    min={2}
                    value={customSides}
                    onChange={(e) => setCustomSides(Number(e.target.value))}
                    className="w-16 bg-transparent/60 border-2 border-cyan-400 rounded px-2 py-1 text-center"
                  />
                </div>
              )}

              <button
                onClick={addDice}
                className="p-2 border-2 border-pink-500 rounded hover:shadow-[0_0_15px_#ff00ff]"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* ROLAGEM ATUAL */}
            <div className="mb-4 text-sm text-cyan-200">
              {dice.map((d, i) => (
                <span key={i} className="mr-2">
                  {d.count}d{d.sides}
                </span>
              ))}
            </div>

            {/* BOTÕES */}
            <div className="flex items-center gap-3">
              <button
                onClick={roll}
                className="flex-1 py-2 border-2 border-green-400 rounded text-green-300 hover:shadow-[0_0_20px_#00ff9c]"
              >
                ROLAR
              </button>
              <button onClick={reset} className="p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </>
        )}

        {results && <Results results={results} onBack={() => setResults(null)} />}
      </div>
    </div>
  );
}

/* ---------- RESULTADOS ---------- */

function Results({ results, onBack }) {
  const [sumOn, setSumOn] = useState(false);
  const [maxOn, setMaxOn] = useState(false);
  const [minOn, setMinOn] = useState(false);

  const randomColor = () =>
    COLORS[Math.floor(Math.random() * COLORS.length)];

  const totalSum = results.reduce(
    (acc, r) => acc + r.values.reduce((a, b) => a + b, 0),
    0
  );

  return (
    <div>
      <div className="flex justify-center gap-2 mb-3">
        <Toggle label="SOMA" active={sumOn} onClick={() => setSumOn(!sumOn)} />
        <Toggle label="MAIOR" active={maxOn} onClick={() => setMaxOn(!maxOn)} />
        <Toggle label="MENOR" active={minOn} onClick={() => setMinOn(!minOn)} />
      </div>

      <div className="space-y-3 text-sm">
        {results.map((r, i) => {
          const sum = r.values.reduce((a, b) => a + b, 0);
          const max = Math.max(...r.values);
          const min = Math.min(...r.values);

          return (
            <div key={i}>
              <div className="font-bold mb-1">d{r.sides}:</div>
              <div className="flex flex-wrap gap-1">
                {r.values.map((v, idx) => {
                  const isMax = maxOn && v === max;
                  const isMin = minOn && v === min;

                  return (
                    <span
                      key={idx}
                      className={`
                        px-1
                        ${isMax ? "text-green-400 animate-pulse" : ""}
                        ${isMin ? "text-red-400 animate-pulse" : ""}
                      `}
                    >
                      {v}
                      {sumOn && idx < r.values.length - 1 && " +"}
                    </span>
                  );
                })}

                {sumOn && (
                  <span className="ml-2" style={{ color: randomColor() }}>
                    = {sum}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {sumOn && (
          <div className="font-bold mt-2" style={{ color: randomColor() }}>
            TOTAL: {totalSum}
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-4 w-full py-1 border-2 border-cyan-400 rounded"
      >
        VOLTAR
      </button>
    </div>
  );
}

/* ---------- TOGGLE ---------- */

function Toggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 border-2 rounded text-xs tracking-widest ${
        active
          ? "border-cyan-400 text-cyan-300 shadow-[0_0_10px_#00eaff]"
          : "border-gray-500 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}
