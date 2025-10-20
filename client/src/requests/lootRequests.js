import $axios from './Axios';

export function generateLoot() {
    return $axios.get('/loot/generate').then(d => d.data)
}