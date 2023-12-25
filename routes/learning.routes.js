const express = require("express");
const router = express.Router();
const {
  allLearningClassCode,
  getAllLearning,
  getLearningByClassCode,
} = require("../controllers/learning.controllers");
const { restrict } = require("../middlewares/auth.middlewares");
const { isAdmin } = require("../middlewares/admin.midlewares");


// Endpoint untuk mengubah status inProgress pada kelas
// router.get('/:classCode', restrict, updateProgres);

router.get("/", isAdmin, getAllLearning);
router.get("/all", restrict, allLearningClassCode);
router.get("/:classCode", restrict, getLearningByClassCode);

module.exports = router;
