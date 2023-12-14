const express = require('express');
const { createBank, banks, bankDetail, deleteBank, updateBank } = require('../controllers/bank.controllers');
const router = express.Router();

router.post('/', createBank);
router.get('/', banks);
router.get('/:id', bankDetail);
router.put('/:id', updateBank);
router.delete('/:id', deleteBank);

module.exports = router;
