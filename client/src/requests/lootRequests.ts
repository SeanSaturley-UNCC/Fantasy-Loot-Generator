import { $axios } from '../services/axios'
import { LootItem, SaveLootBody, SortOrder } from '../Types';

export const generateLoot = async (): Promise<LootItem> => {
    const { data } = await $axios.get('/loot/generate');
    return data;
}

export const saveLoot = async (body: SaveLootBody): Promise<{ message: string; loot: LootItem }> => {
    const { data } = await $axios.post('/loot/save', body);
    return data;
}

export const getUserInventory = async (
    userId: string, 
    sortBy: string | null = null, 
    sortOrder: any
): Promise<LootItem[]> => {
    let url = `/loot/inventory/${userId}`;
    const params = new URLSearchParams();
    
    if (sortBy && sortOrder) {
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder.toString());
    }
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    
    const { data } = await $axios.get(url);
    return data.inventory;
}

export const discardLoot = async (lootId: string): Promise<{ message: string }> => {
    const { data } = await $axios.delete(`/loot/discard/${lootId}`);
    return data;
}
