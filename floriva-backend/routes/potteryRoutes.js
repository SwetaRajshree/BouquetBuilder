const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/potteryController');

router.get('/', getAll);

module.exports = router;
