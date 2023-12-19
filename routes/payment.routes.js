const router = require('express').Router();
const { getTransactions, getDetailTransaction, createTransaction} = require('../controllers/payment.controllers');

router.get('/', getTransactions);  // Endpoint untuk pengguna biasa
router.get('/:id', getDetailTransaction);
router.post('/:classCode', createTransaction);

module.exports = router;
