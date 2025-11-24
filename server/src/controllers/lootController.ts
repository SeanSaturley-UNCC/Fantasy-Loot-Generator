import { Request, Response, NextFunction } from 'express'
import { generateItem, Loot } from '../Models/lootModel'
import User from '../Models/User'
import { handleError } from '../middleware/utils'

export const generateLoot = (_req: Request, res: Response, next: NextFunction) => {
    try {
        const item = generateItem()
        res.json(item)
    } catch (err) {
        next(err)
    }
}

export const saveLoot = async (req: Request, res: Response): Promise<void> => {
    try {
        const { body } = req
        const user = res.locals.user
        const lootData = body.loot

        // Check if loot with exact same parameters already exists
        const existingLoot = await Loot.findOne({
            name: lootData.name,
            type: lootData.type,
            rarity: lootData.rarity,
            value: lootData.value
        })

        if (existingLoot) {
            res.status(400).json({
                error: 'Loot item with identical parameters already exists',
                existingLootId: existingLoot._id
            })
            return
        }

        const savedLoot = await Loot.create(lootData)
        await User.updateOne(
            {
                _id: user._id
            },
            {
                $push: {
                    inventory: savedLoot._id
                }
            }
        )
        res.status(200).json(savedLoot)
    } catch (err) {
        handleError(err as Error, res)
    }
}

export const getUserInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params
        const { sortBy, sortOrder } = req.query
        
        // Default sort by createdAt descending if no sort specified
        let sortOptions: Record<string, number> = { createdAt: -1 }
        
        if (sortBy && sortOrder) {
            const order = parseInt(sortOrder as string)
            
            // Special handling for rarity sorting
            if (sortBy === 'rarity') {
                const user = await User.findOne({ _id: userId }).populate('inventory')
                
                if (!user) {
                    res.status(404).json({ error: 'User not found' })
                    return
                }
                
                // Define rarity order for sorting
                const rarityOrder: Record<string, number> = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5 }
                
                const sortedInventory = user.inventory.sort((a: any, b: any) => {
                    const aRarity = rarityOrder[a.rarity] || 0
                    const bRarity = rarityOrder[b.rarity] || 0
                    return order === 1 ? aRarity - bRarity : bRarity - aRarity
                })
                
                res.status(200).json({ inventory: sortedInventory })
                return
            } else {
                sortOptions = { [sortBy as string]: order }
            }
        }
        
        const user = await User.findOne({
            _id: userId
        }).populate({
            path: 'inventory',
            options: { sort: sortOptions }
        })
        
        res.status(200).json({ inventory: user?.inventory || [] })
    } catch (err) {
        handleError(err as Error, res)
    }
}

export const discardLoot = async (req: Request, res: Response): Promise<void> => {
    try {
        const { lootId } = req.params
        const user = res.locals.user

        // Remove the loot item from the user's inventory
        await User.updateOne(
            { _id: user._id },
            { $pull: { inventory: lootId } }
        )

        // Delete the loot item from the database
        await Loot.findByIdAndDelete(lootId)

        res.status(200).json({ message: 'Item discarded successfully' })
    } catch (err) {
        handleError(err as Error, res)
    }
}
