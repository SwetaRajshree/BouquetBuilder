const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/handloomController');

router.get('/', getAll);

module.exports = router;
