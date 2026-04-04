const express = require('express');
const router = express.Router();
const { submit, getAll } = require('../controllers/artistApplicationController');

router.post('/', submit);
router.get('/', getAll);

module.exports = router;
