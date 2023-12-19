const router = require("express").Router();
const {
  getTransactionsAdmin,
  getDetailTransaction,
  deleteTransaction,
} = require("../controllers/admin.payment.controllers");
const { isAdmin } = require("../middlewares/admin.midlewares"); 

router.get("/", getTransactionsAdmin);
router.get("/:id", getDetailTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
