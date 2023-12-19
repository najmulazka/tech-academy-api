const express = require("express");
const {
  createBank,
  banks,
  bankDetail,
  deleteBank,
  updateBank,
} = require("../controllers/bank.controllers");
const router = express.Router();
const { isAdmin } = require("../middlewares/admin.midlewares");

router.post("/", isAdmin, createBank);
router.get("/", banks);
router.get("/:id", bankDetail);
router.put("/:id", isAdmin, updateBank);
router.delete("/:id", isAdmin, deleteBank);

module.exports = router;
