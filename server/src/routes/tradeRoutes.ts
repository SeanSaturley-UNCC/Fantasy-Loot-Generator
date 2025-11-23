import express from 'express'
import { authenticate } from '../middleware/utils'
import * as trade from '../controllers/tradeController'

const router = express.Router()

// Create a new trade offer
router.route('/create')
    .post(
        authenticate,
        trade.createTrade
    )

// Get a single trade by ID
router.route('/:tradeId')
    .get(
        authenticate,
        trade.getOneTrade
    )

// Delete/cancel a trade
router.route('/:tradeId')
    .delete(
        authenticate,
        trade.deleteOneTrade
    )

// Get all trades for a user (sent, received, or all)
router.route('/user/:userId')
    .get(
        authenticate,
        trade.getAllTrades
    )

// Approve or deny a trade
router.route('/:tradeId/respond')
    .post(
        authenticate,
        trade.approveTrade
    )

export default router
