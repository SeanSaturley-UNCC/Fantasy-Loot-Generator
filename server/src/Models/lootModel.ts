/**
 * models/lootModel.ts
 * Clean loot generator with weighted rarity, type-based effects, and stats
 */

import mongoose, { Document, Schema } from 'mongoose'

// Interfaces
export interface LootStats {
    stat: string
    value: number
}

export interface LootDocument extends Document {
    name: string
    type: 'Sword' | 'Shield' | 'Potion' | 'Bow' | 'Armor'
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
    effects: string[]
    stats: LootStats[]
    value: number
    createdAt: Date
    updatedAt: Date
}

interface RarityWeight {
    name: string
    weight: number
    valueMult: number
}

// Define schema
const lootSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            required: true,
            enum: ['Sword', 'Shield', 'Potion', 'Bow', 'Armor']
        },
        rarity: {
            type: String,
            required: true,
            enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
        },
        effects: {
            type: [String],
            default: []
        },
        stats: {
            type: [
                {
                    stat: { type: String, required: true },
                    value: { type: Number, required: true }
                }
            ],
            default: []
        },
        value: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// Create model
const Loot = mongoose.model<LootDocument>('Loot', lootSchema)

// Utility functions
function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function pickWeighted(items: RarityWeight[]): string {
    const total = items.reduce((sum, it) => sum + it.weight, 0)
    let r = Math.random() * total
    for (const it of items) {
        r -= it.weight
        if (r <= 0) return it.name
    }
    return items[0].name
}

const rarities: RarityWeight[] = [
    { name: 'Common', weight: 60, valueMult: 1.0 },
    { name: 'Uncommon', weight: 25, valueMult: 1.5 },
    { name: 'Rare', weight: 10, valueMult: 2.5 },
    { name: 'Epic', weight: 4, valueMult: 4.0 },
    { name: 'Legendary', weight: 1, valueMult: 7.0 }
]

type LootType = 'Sword' | 'Shield' | 'Potion' | 'Bow' | 'Armor'

const types: LootType[] = ['Sword', 'Shield', 'Potion', 'Bow', 'Armor']
const adjectives = ['Flaming', 'Frozen', 'Shadow', 'Radiant', 'Thunder', 'Venom', 'Blessed', 'Cursed']

const effectsByType: Record<LootType, string[]> = {
    Sword: ['Bleed', 'Parry', 'Lifesteal', 'Crit Chance'],
    Bow: ['Piercing', 'Quickdraw', 'Multi-shot', 'Crit Damage'],
    Shield: ['Thorns', 'Block', 'Stagger', 'Elemental Ward'],
    Armor: ['Fire Ward', 'Ice Ward', 'Poison Resist', 'Health Regen'],
    Potion: ['Healing', 'Mana', 'Stamina', 'Antidote']
}

function rarityInfo(name: string): RarityWeight {
    return rarities.find(r => r.name === name) || rarities[0]
}

function rollStatsFor(type: LootType): LootStats[] {
    if (type === 'Sword' || type === 'Bow') {
        return [{ stat: 'Attack', value: Math.floor(Math.random() * 10) + 5 }]
    }
    if (type === 'Shield' || type === 'Armor') {
        return [{ stat: 'Defense', value: Math.floor(Math.random() * 10) + 5 }]
    }
    if (type === 'Potion') {
        const potency = Math.floor(Math.random() * 3) + 1
        return [{ stat: 'Potency', value: potency }]
    }
    return []
}

function generateItem() {
    const type = pick<LootType>(types)
    const rarity = pickWeighted(rarities)
    const adj = pick(adjectives)

    const pool = effectsByType[type] || []
    const numEffects = (type === 'Potion') ? 1 : (Math.random() < 0.5 ? 1 : 2)
    const effects: string[] = []
    while (effects.length < numEffects && pool.length) {
        const e = pick(pool)
        if (!effects.includes(e)) effects.push(e)
    }

    const stats = rollStatsFor(type)
    const baseValue = Math.floor(Math.random() * 41) + 20
    const value = Math.floor(baseValue * rarityInfo(rarity).valueMult)

    const name = `${adj} ${type}`
    return { name, type, rarity, effects, stats, value }
}

// Export both the Mongoose model and the generator function
export {
    Loot,
    generateItem
}
