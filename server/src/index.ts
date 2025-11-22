import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import routes from './routes'
import { verifyClient } from './middleware/auth'

const app = express()

app.use(cookieParser('someVerySecretKey'))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:1212',
    credentials: true
}))

// @ts-ignore
app.use(verifyClient)
app.use(routes)

const start = async () => {
    try {
        const port = 5000
        await mongoose.connect('mongodb://root:examplepassword@mongo:27017/mydb?authSource=admin')
        console.log('Connected to MongoDB')
        app.listen(port, () => console.log('Server listening on port ' +  port +'\n'))
    } catch (err) {
        console.error('Something went wrong starting the server\n', err)
    }
}
start()
