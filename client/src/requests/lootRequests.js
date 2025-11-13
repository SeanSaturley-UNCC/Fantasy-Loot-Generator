import $axios from './Axios';

export function generateLoot() {
    return $axios.get('/loot/generate').then(d => d.data)
}

export function saveLoot(
    body
) {
    return $axios.post('/loot/save', body).then(d => d.data)
}

export function getUserInventory(userId, sortBy = null, sortOrder = null) {
    let url = `/loot/inventory/${userId}`;
    const params = new URLSearchParams();
    
    if (sortBy && sortOrder) {
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder.toString());
    }
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    
    return $axios.get(url).then(d => d.data.inventory)
}

export function discardLoot(lootId) {
    return $axios.delete(`/loot/discard/${lootId}`).then(d => d.data)
}
