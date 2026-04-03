const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/paintingController');

router.get('/', getAll);

module.exports = router;
