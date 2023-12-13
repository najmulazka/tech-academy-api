const router = require("express").Router();
const {
  createChapter,
  getChapter,
  getByIdChapter,
  getPresentaseChapter,
  updateChapter,
  deletedChapter,
} = require("../controllers/chapter.controllers");
const { restrict } = require("../middlewares/auth.middlewares");


router.post("/", createChapter);
router.get("/", getChapter);
router.get("/:id", getByIdChapter);
router.get("/presentase/:classCode/:id", restrict, getPresentaseChapter);
router.put("/:id", updateChapter);
router.delete("/:id", deletedChapter);
module.exports = router;
