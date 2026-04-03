const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/woodenSculptureController');

router.get('/', getAll);

module.exports = router;
