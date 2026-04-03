const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/stoneArtController');

router.get('/', getAll);

module.exports = router;
