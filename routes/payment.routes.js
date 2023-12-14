const router = require('express').Router();
const { getTransactions, getDetailTransaction, createTransaction, payment} = require('../controllers/payment.controllers');

router.get('/', getTransactions);  // Endpoint untuk pengguna biasa
router.get('/:id', getDetailTransaction);
router.post('/:classCode', createTransaction);
router.put('/:id', payment);

module.exports = router;
