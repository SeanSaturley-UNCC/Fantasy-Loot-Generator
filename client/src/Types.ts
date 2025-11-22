
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

