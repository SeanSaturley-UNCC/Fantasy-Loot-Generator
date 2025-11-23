import { Request, Response, NextFunction } from 'express'
import { Trade } from '../Models/tradeModel'
import User from '../Models/User'
import { Loot } from '../Models/lootModel'
import { handleError } from '../middleware/utils'

// Create a new trade offer
export const createTrade = async (req: Request, res: Response): Promise<void> => {
    try {
        const { offeredItemId, requestedItemId, offeredByUserId, requestedFromUserId } = req.body

        // Validate that the offered item exists and belongs to the sender
        const offeredItem = await Loot.findById(offeredItemId)
        if (!offeredItem) {
            res.status(404).json({ error: 'Offered item not found' })
            return
        }

        const sender = await User.findById(offeredByUserId)
        if (!sender) {
            res.status(404).json({ error: 'Sender user not found' })
            return
        }

        const senderOwnsItem = sender.inventory.some(
            item => item.toString() === offeredItemId.toString()
        )
        if (!senderOwnsItem) {
            res.status(400).json({ error: 'You do not own the offered item' })
            return
        }

        // Validate that the requested item exists and belongs to the receiver
        const requestedItem = await Loot.findById(requestedItemId)
        if (!requestedItem) {
            res.status(404).json({ error: 'Requested item not found' })
            return
        }

        const receiver = await User.findById(requestedFromUserId)
        if (!receiver) {
            res.status(404).json({ error: 'Receiver user not found' })
            return
        }

        const receiverOwnsItem = receiver.inventory.some(
            item => item.toString() === requestedItemId.toString()
        )
        if (!receiverOwnsItem) {
            res.status(400).json({ error: 'The requested item is not in the receiver\'s inventory' })
            return
        }

        // Create the trade
        const trade = await Trade.create({
            offeredItem: offeredItemId,
            requestedItem: requestedItemId,
            offeredByUser: offeredByUserId,
            requestedFromUser: requestedFromUserId,
            status: 'Pending'
        })

        res.status(201).json({
            message: 'Trade offer created successfully',
            trade
        })
    } catch (err) {
        handleError(err as Error, res)
    }
}

// Get a single trade by ID
export const getOneTrade = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tradeId } = req.params

        const trade = await Trade.findById(tradeId)
            .populate('offeredItem')
            .populate('requestedItem')
            .populate('offeredByUser', 'username email')
            .populate('requestedFromUser', 'username email')

        if (!trade) {
            res.status(404).json({ error: 'Trade not found' })
            return
        }

        res.status(200).json(trade)
    } catch (err) {
        handleError(err as Error, res)
    }
}

// Get all trades for a user (sent or received)
export const getAllTrades = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params
        const { filter } = req.query // 'sent', 'received', or 'all'

        let query: any = {}

        if (filter === 'sent') {
            query.offeredByUser = userId
        } else if (filter === 'received') {
            query.requestedFromUser = userId
        } else {
            // Default to 'all'
            query.$or = [
                { offeredByUser: userId },
                { requestedFromUser: userId }
            ]
        }

        const trades = await Trade.find(query)
            .populate('offeredItem')
            .populate('requestedItem')
            .populate('offeredByUser', 'username email')
            .populate('requestedFromUser', 'username email')
            .sort({ createdAt: -1 })

        res.status(200).json(trades)
    } catch (err) {
        handleError(err as Error, res)
    }
}

// Delete a trade by ID
export const deleteOneTrade = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tradeId } = req.params
        const { userId } = req.body // User requesting the deletion

        const trade = await Trade.findById(tradeId)

        if (!trade) {
            res.status(404).json({ error: 'Trade not found' })
            return
        }

        // Only the sender can delete/cancel a trade
        if (trade.offeredByUser.toString() !== userId.toString()) {
            res.status(403).json({ error: 'You can only delete trades you created' })
            return
        }

        // Can only delete pending trades
        if (trade.status !== 'Pending') {
            res.status(400).json({ error: 'Can only delete pending trades' })
            return
        }

        await Trade.findByIdAndDelete(tradeId)

        res.status(200).json({ message: 'Trade deleted successfully' })
    } catch (err) {
        handleError(err as Error, res)
    }
}

// Approve or deny a trade
export const approveTrade = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tradeId } = req.params
        const { userId, action } = req.body // action: 'approve' or 'deny'

        if (!['approve', 'deny'].includes(action)) {
            res.status(400).json({ error: 'Invalid action. Must be "approve" or "deny"' })
            return
        }

        const trade = await Trade.findById(tradeId)

        if (!trade) {
            res.status(404).json({ error: 'Trade not found' })
            return
        }

        // Only the receiver can approve/deny
        if (trade.requestedFromUser.toString() !== userId.toString()) {
            res.status(403).json({ error: 'Only the receiver can approve or deny this trade' })
            return
        }

        // Can only approve/deny pending trades
        if (trade.status !== 'Pending') {
            res.status(400).json({ error: 'This trade has already been processed' })
            return
        }

        if (action === 'deny') {
            trade.status = 'Declined'
            await trade.save()
            res.status(200).json({ message: 'Trade declined', trade })
            return
        }

        // Approve trade - swap items between inventories
        const sender = await User.findById(trade.offeredByUser)
        const receiver = await User.findById(trade.requestedFromUser)

        if (!sender || !receiver) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        // Verify items still exist in respective inventories
        const offeredItemId = (trade.offeredItem as any)._id || trade.offeredItem
        const requestedItemId = (trade.requestedItem as any)._id || trade.requestedItem

        const senderHasItem = sender.inventory.some(
            item => item.toString() === offeredItemId.toString()
        )
        const receiverHasItem = receiver.inventory.some(
            item => item.toString() === requestedItemId.toString()
        )

        if (!senderHasItem) {
            res.status(400).json({ error: 'Offered item no longer in sender\'s inventory' })
            return
        }

        if (!receiverHasItem) {
            res.status(400).json({ error: 'Requested item no longer in your inventory' })
            return
        }

        // Perform the swap
        // Remove offered item from sender, add to receiver
        sender.inventory = sender.inventory.filter(
            item => item.toString() !== offeredItemId.toString()
        )
        receiver.inventory.push(offeredItemId as any)

        // Remove requested item from receiver, add to sender
        receiver.inventory = receiver.inventory.filter(
            item => item.toString() !== requestedItemId.toString()
        )
        sender.inventory.push(requestedItemId as any)

        // Save users and update trade status
        await sender.save()
        await receiver.save()

        trade.status = 'Accepted'
        await trade.save()

        res.status(200).json({
            message: 'Trade accepted successfully',
            trade
        })
    } catch (err) {
        handleError(err as Error, res)
    }
}
