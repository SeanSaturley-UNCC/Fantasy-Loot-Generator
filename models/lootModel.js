/**
 * models/lootModel.js
 * Clean loot generator with weighted rarity, type-based effects, and stats.
 */

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(items) {
  const total = items.reduce((sum, it) => sum + it.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it.name;
  }
  return items[0].name; // fallback
}

const rarities = [
  { name: 'Common',    weight: 60, valueMult: 1.0 },
  { name: 'Uncommon',  weight: 25, valueMult: 1.5 },
  { name: 'Rare',      weight: 10, valueMult: 2.5 },
  { name: 'Epic',      weight: 4,  valueMult: 4.0 },
  { name: 'Legendary', weight: 1,  valueMult: 7.0 },
];

const types = ['Sword', 'Shield', 'Potion', 'Bow', 'Armor'];
const adjectives = ['Flaming', 'Frozen', 'Shadow', 'Radiant', 'Thunder', 'Venom', 'Blessed', 'Cursed'];

const effectsByType = {
  Sword:  ['Bleed', 'Parry', 'Lifesteal', 'Crit Chance'],
  Bow:    ['Piercing', 'Quickdraw', 'Multi-shot', 'Crit Damage'],
  Shield: ['Thorns', 'Block', 'Stagger', 'Elemental Ward'],
  Armor:  ['Fire Ward', 'Ice Ward', 'Poison Resist', 'Health Regen'],
  Potion: ['Healing', 'Mana', 'Stamina', 'Antidote'],
};

function rarityInfo(name) {
  return rarities.find(r => r.name === name) || rarities[0];
}

function rollStatsFor(type) {
  if (type === 'Sword' || type === 'Bow') {
    return [{ stat: 'Attack', value: Math.floor(Math.random() * 10) + 5 }];
  }
  if (type === 'Shield' || type === 'Armor') {
    return [{ stat: 'Defense', value: Math.floor(Math.random() * 10) + 5 }];
  }
  if (type === 'Potion') {
    const potency = Math.floor(Math.random() * 3) + 1;
    return [{ stat: 'Potency', value: potency }];
  }
  return [];
}

function generateItem() {
  const type = pick(types);
  const rarity = pickWeighted(rarities);
  const adj = pick(adjectives);

  const pool = effectsByType[type] || [];
  const numEffects = (type === 'Potion') ? 1 : (Math.random() < 0.5 ? 1 : 2);
  const effects = [];
  while (effects.length < numEffects && pool.length) {
    const e = pick(pool);
    if (!effects.includes(e)) effects.push(e);
  }

  const stats = rollStatsFor(type);
  const baseValue = Math.floor(Math.random() * 41) + 20;
  const value = Math.floor(baseValue * rarityInfo(rarity).valueMult);

  const name = `${adj} ${type}`;
  return { name, type, rarity, effects, stats, value };
}

module.exports = { generateItem };
