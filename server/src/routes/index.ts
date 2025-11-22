import express from 'express'

// routes
import userRoutes from './userRoutes'
import lootRoutes from './lootRoutes'

const mainRouter = express()

mainRouter.use('/users', userRoutes)
mainRouter.use('/loot', lootRoutes)

export default mainRouter
