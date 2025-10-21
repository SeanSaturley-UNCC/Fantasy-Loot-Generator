const express = require('express');
const router = express.Router();
const loot = require('../controllers/lootController');
const { authenticate } = require('../utils');

router.route('/generate')
    //! Generate a new loot item
    .get(
        // authenticate,
        loot.generateLoot
    )

module.exports = router;
