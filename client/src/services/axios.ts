import axios from 'axios'

export const $axios = axios.create({
    baseURL: 'http://localhost:4545/',
    withCredentials: true,
    headers: {
        'x-client-key': 'eaa2de90-688f-4cbf-99cd-c30f837b3be4'
    }
})
