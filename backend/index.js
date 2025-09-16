const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 5000;

// Weighted rarity system
const rarityTable = [
  { rarity: "Common", weight: 60 },
  { rarity: "Rare", weight: 25 },
  { rarity: "Epic", weight: 10 },
  { rarity: "Legendary", weight: 5 },
];

const types = ["Sword", "Shield", "Potion", "Bow", "Armor"];

const effectsByType = {
  Sword: ["Flame Strike", "Poison", "Bleed", null],
  Shield: ["Absorb Damage", "Reflect", null],
  Potion: ["Heal 10 HP", "Mana Restore", "Antidote"],
  Bow: ["Piercing Arrow", "Poison Shot", null],
  Armor: ["Thorns", "Fire Resistance", null],
};

// Helper: pick weighted rarity
function getWeightedRarity() {
  const totalWeight = rarityTable.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let r of rarityTable) {
    if (roll < r.weight) return r.rarity;
    roll -= r.weight;
  }
  return "Common"; // fallback
}

// Loot Generator Function
function generateItem() {
  const type = types[Math.floor(Math.random() * types.length)];
  const rarity = getWeightedRarity();

  // Stats depend on type
  let stats = [];
  if (type === "Sword" || type === "Bow") {
    stats.push({ stat: "Attack", value: Math.floor(Math.random() * 10) + 5 });
  }
  if (type === "Shield" || type === "Armor") {
    stats.push({ stat: "Defense", value: Math.floor(Math.random() * 10) + 5 });
  }
  if (type === "Potion") {
    stats.push({ stat: "Magic", value: Math.floor(Math.random() * 10) + 1 });
  }

  // Optional effect
  const effects = effectsByType[type];
  const effect = effects[Math.floor(Math.random() * effects.length)];

  return {
    name: `${rarity} ${type}`,
    type,
    rarity,
    stats,
    effect,
  };
}

// API endpoint
app.get("/generate-item", (req, res) => {
  const item = generateItem();
  res.json(item);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { generateItem };
