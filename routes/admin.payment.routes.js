const router = require("express").Router();
const {
  getTransactionsAdmin,
  getDetailTransaction,
  deleteTransaction,
  validateTransaction,
} = require("../controllers/admin.payment.controllers");
const { isAdmin } = require("../middlewares/admin.midlewares"); 

router.get("/", getTransactionsAdmin);
router.get("/:id", getDetailTransaction);
router.put("/:id", validateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
