const express = require('express');
const router = express.Router();
const loot = require('../controllers/lootController');
const { authenticate } = require('../utils');

router.route('/generate')
    //! Generate a new loot item
    .get(
        authenticate,
        loot.generateLoot
    )

router.route(
    '/save'
).post(
    authenticate,
    loot.saveLoot
)

router.route(
    '/inventory/:userId'
).get(
    authenticate,
    loot.getUserInventory
)

router.route(
    '/discard/:lootId'
).delete(
    authenticate,
    loot.discardLoot
)

module.exports = router;
