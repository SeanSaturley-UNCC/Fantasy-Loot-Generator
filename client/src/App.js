import React, { useState } from "react";
import "./App.css";
import { generateLoot } from "./requests/lootRequests";


function App() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const handleGenerateItem = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await generateLoot()
            setItem(data);
        } catch (error) {
            setError('Failed to generate item.' + error.message);
        }
        setLoading(false)
    }

  const rarityColors = {
    Common: "#9E9E9E",
    Uncommon: "#388E3C",
    Rare: "#1E88E5",
    Epic: "#8E24AA",
    Legendary: "#FFD700",
  };

  return (
    <div className="App">
      <h1>Fantasy Loot Generator</h1>

      <button className="generate-btn" onClick={handleGenerateItem} disabled={loading}>
        {loading ? "Generating…" : "Generate Item"}
      </button>

      {error && <div className="error">{error}</div>}

      {item && (
        <div
          className="item-card"
          style={{ borderColor: rarityColors[item.rarity] || "#333" }}
          aria-live="polite"
        >
          <h2 style={{ color: rarityColors[item.rarity] || "#333" }}>{item.name}</h2>

          <p><strong>Type:</strong> {item.type}</p>
          <p><strong>Rarity:</strong> {item.rarity}</p>

          {Array.isArray(item.stats) && item.stats.length > 0 && (
            <>
              <p><strong>Stats:</strong></p>
              <ul>
                {item.stats.map((s, i) => (
                  <li key={i}>{s.stat}: {s.value}</li>
                ))}
              </ul>
            </>
          )}

          {Array.isArray(item.effects) && item.effects.length > 0 && (
            <>
              <p><strong>Effects:</strong></p>
              <ul>
                {item.effects.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
