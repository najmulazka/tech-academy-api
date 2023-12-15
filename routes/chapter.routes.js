const router = require("express").Router();
const {
  createChapter,
  getChapter,
  getByIdChapter,
  updateChapter,
  deletedChapter,
} = require("../controllers/chapter.controllers");
const { isAdmin } = require("../middlewares/admin.midlewares");

router.post("/", isAdmin, createChapter);
router.get("/", getChapter);
router.get("/:id", getByIdChapter);
router.put("/:id", isAdmin, updateChapter);
router.delete("/:id", isAdmin, deletedChapter);
module.exports = router;
