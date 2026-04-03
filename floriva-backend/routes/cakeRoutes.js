const express = require('express');
const router = express.Router();
const { getAllCakes, getCakeById } = require('../controllers/cakeController');

router.get('/', getAllCakes);
router.get('/:id', getCakeById);

module.exports = router;
