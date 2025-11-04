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

