const { generateItem } = require('../models/lootModel');

exports.generateLoot = (req, res, next) => {
  try {
    const item = generateItem();
    res.json(item);
  } catch (err) {
    next(err);
  }
};
