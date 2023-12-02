const router = require("express").Router();
const {
  createChapter,
  getChapter,
  getByIdChapter,
  updateChapter,
  deletedChapter,
} = require("../controllers/chapter.controllers");

router.post("/", createChapter);
router.get("/", getChapter);
router.get("/:id", getByIdChapter);
router.put("/:id", updateChapter);
router.delete("/:id", deletedChapter);
module.exports = router;
