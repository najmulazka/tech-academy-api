const router = require("express").Router();
const {
  createChapter,
  getChapter,
  getByIdChapter,
  getPresentaseChapter,
  updateChapter,
  deletedChapter,
} = require("../controllers/chapter.controllers");
const { isAdmin } = require("../middlewares/admin.midlewares");
const { restrict } = require("../middlewares/auth.middlewares");


router.post("/", isAdmin, createChapter);
router.get("/", getChapter);
router.get("/:id", getByIdChapter);
router.put("/:id", isAdmin, updateChapter);
router.delete("/:id", isAdmin, deletedChapter);
router.get("/presentase/:classCode/:id", restrict, getPresentaseChapter);
module.exports = router;
