const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
const PORT = 5000;

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://user:user123@lootgenerator.dbn11j4.mongodb.net/?retryWrites=true&w=majority&appName=LootGenerator"
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Item Schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  rarity: {
    type: String,
    required: true,
  },
  stats: [{
    stat: String,
    value: Number,
  }],
  effect: String, // Can be null
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("Item", itemSchema);

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

// API endpoint: Generate item
app.get("/generate-item", (req, res) => {
  const item = generateItem();
  res.json(item);
});

// API endpoint: Save item to inventory
app.post("/save-item", async (req, res) => {
  try {
    const itemData = req.body;
    const item = new Item(itemData);
    await item.save();
    res.status(201).json({ message: "Item saved successfully", item });
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ error: "Failed to save item" });
  }
});

// API endpoint: Get inventory
app.get("/inventory", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { generateItem };