import axios from 'axios'

// ? 'bridge' from client to server
const bridge = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
    headers: {
        ['qwertyasdfgzxcvb']: 'eaa2de90-688f-4cbf-99cd-c30f837b3be4'
    }
})

export default bridge