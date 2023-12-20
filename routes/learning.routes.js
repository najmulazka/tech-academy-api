const express = require("express");
const router = express.Router();
const {
  getAllLearning,
  getLearningById,
} = require("../controllers/learning.controllers");
const { restrict } = require("../middlewares/auth.middlewares");

// Endpoint untuk mengubah status inProgress pada kelas
// router.get('/:classCode', restrict, updateProgres);

router.get("/", restrict, getAllLearning);
router.get("/:id", restrict, getLearningById);

module.exports = router;
