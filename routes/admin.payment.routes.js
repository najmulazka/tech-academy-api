const router = require("express").Router();
const {
  getTransactionsAdmin,
  getDetailTransaction,
  deleteTransaction,
} = require("../controllers/admin.payment.controllers");
const { isAdmin } = require("../middlewares/admin.midlewares"); 

router.get("/", isAdmin, getTransactionsAdmin);
router.get("/:id", isAdmin, getDetailTransaction);
router.delete("/:id", isAdmin, deleteTransaction);

module.exports = router;
