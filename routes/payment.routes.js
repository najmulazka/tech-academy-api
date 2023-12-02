const router = require('express').Router();
const { transaction } = require('../middlewares/transactions.middlewares');
const { createTransaction, getTransactions, getDetailTransaction, getTransactionsAdmin } = require('../controllers/payment.controllers');
const { admin } = require('../middlewares/admin.midlewares');

router.post('/:classCode', transaction, createTransaction);
router.get('/', getTransactions);
router.get('/:id', getDetailTransaction);

router.get('/admin', admin, getTransactionsAdmin);


module.exports = router;
