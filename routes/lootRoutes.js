const express = require('express');
const router = express.Router();
const loot = require('../controllers/lootController');

// GET /loot/generate
router.get('/generate', loot.generateLoot);

module.exports = router;
