import express from 'express'

// routes
import userRoutes from './userRoutes'
import lootRoutes from './lootRoutes'
import tradeRoutes from './tradeRoutes'

const mainRouter = express()

mainRouter.use('/users', userRoutes)
mainRouter.use('/loot', lootRoutes)
mainRouter.use('/trades', tradeRoutes)

export default mainRouter
