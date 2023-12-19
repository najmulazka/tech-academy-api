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
const {restrict} = require("../middlewares/auth.middlewares")

router.post("/", isAdmin, createBank);
router.get("/", restrict, banks);
router.get("/:id", restrict, bankDetail);
router.put("/:id", isAdmin, updateBank);
router.delete("/:id", isAdmin, deleteBank);

module.exports = router;
