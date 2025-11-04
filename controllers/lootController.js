const { generateItem, Loot } = require('../models/lootModel');
const User = require('../models/User');
const { handleError } = require('../utils');

exports.generateLoot = (_req, res, next) => {
  try {
    const item = generateItem();
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.saveLoot = async (req, res) => {
    try {
        const { body } = req
        const user = res.locals.user

        // Check if loot with exact same parameters already exists
        const existingLoot = await Loot.findOne({
            name: body.name,
            type: body.type,
            rarity: body.rarity,
            value: body.value
        })

        if (existingLoot) {
            return res.status(400).json({
                error: 'Loot item with identical parameters already exists',
                existingLootId: existingLoot._id
            });
        }

        const savedLoot = await Loot.create(body)

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
        handleError(err, res)
    }
};

exports.getUserInventory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { sortBy, sortOrder } = req.query;
        
        // Default sort by createdAt ascending if no sort specified
        let sortOptions = { createdAt: 1 };
        
        if (sortBy && sortOrder) {
            const order = parseInt(sortOrder);
            
            // Special handling for rarity sorting
            if (sortBy === 'rarity') {
                const user = await User.findOne({ _id: userId }).populate('inventory');
                
                // Define rarity order for sorting
                const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5 };
                
                const sortedInventory = user.inventory.sort((a, b) => {
                    const aRarity = rarityOrder[a.rarity] || 0;
                    const bRarity = rarityOrder[b.rarity] || 0;
                    return order === 1 ? aRarity - bRarity : bRarity - aRarity;
                });
                
                return res.status(200).json({ inventory: sortedInventory });
            } else {
                sortOptions = { [sortBy]: order };
            }
        }
        
        const user = await User.findOne({
            _id: userId
        }).populate({
            path: 'inventory',
            options: { sort: sortOptions }
        });
        
        res.status(200).json({ inventory: user.inventory })
    } catch (err) {
        handleError(err, res)
    }
}

exports.discardLoot = async (req, res) => {
    try {
        const { lootId } = req.params;
        const user = res.locals.user;

        // Remove the loot item from the user's inventory
        await User.updateOne(
            { _id: user._id },
            { $pull: { inventory: lootId } }
        );

        // Delete the loot item from the database
        await Loot.findByIdAndDelete(lootId);

        res.status(200).json({ message: 'Item discarded successfully' });
    } catch (err) {
        handleError(err, res);
    }
};

