const express = require('express');
const router = express.Router();
const { generateLoot, list } = require('../controllers/lootController');
router.get('/generate', generateLoot);
router.get('/', list);
module.exports = router;
