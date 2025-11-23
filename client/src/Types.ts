
export interface UserData {
    username: string
    email: string
    password: string
}

export interface Credentials {
    username?: string
    email?: string
    password: string
}

export interface User {
    _id: string
    username: string
    email: string
    createdAt: Date
    updatedAt?: Date
}

export interface LoginResponse {
    user: User
    message?: string
}

export interface UpdateData {
    username?: string
    email?: string
}

export interface PasswordData {
    currentPassword: string
    newPassword: string
}

export interface LootItem {
    _id: string
    name: string
    type: string
    rarity: string
    description: string
    value: number
    createdAt: Date
}


export interface SaveLootBody {
    userId: string
    loot: Omit<LootItem, '_id' | 'createdAt'>
}

export interface Inventory {
    userId: string
    items: LootItem[]
}

export type SortOrder = 'asc' | 'desc' | 1 | -1

export interface TradeData {
    offeredItem: LootDocument
    requestedItem: LootDocument
    offeredByUser: User
    requestedFromUser: User
    status: 'Pending' | 'Accepted' | 'Declined'
    createdAt: Date
    updatedAt?: Date
    _id: string
}

export interface CreateTradeBody {
    offeredItemId: string
    requestedItemId: string
    offeredByUserId: string
    requestedFromUserId: string
}

export interface RespondToTradeBody {
    userId: string
    action: 'approve' | 'deny'
}

export interface DeleteTradeBody {
    userId: string
}

export interface LootCardProps {
    item: LootDocument
    buttonText?: string
    buttonColor?: string
    onButtonClick?: (item: LootDocument) => void
    buttonStyle?: React.CSSProperties
}

export type RarityType = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'

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
    _id: string
}

export interface RarityWeight {
    name: string
    weight: number
    valueMult: number
}

