const router = require('express').Router();
const { getTransactions, getDetailTransaction, createTransaction, payment } = require('../controllers/payment.controllers');
const { restrict } = require('../middlewares/auth.middlewares');

router.get('/', restrict, getTransactions);  // Endpoint untuk pengguna biasa
router.get('/:id', restrict, getDetailTransaction);
router.post('/:classCode', restrict, createTransaction);
router.post('/:id', restrict, payment);

module.exports = router;
