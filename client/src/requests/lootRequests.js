import $axios from './Axios';

export function generateLoot() {
    return $axios.get('/loot/generate').then(d => d.data)
}

export function saveLoot(
    body
) {
    return $axios.post('/loot/save', body).then(d => d.data)
}
