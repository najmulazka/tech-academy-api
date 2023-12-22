const express = require("express");
const router = express.Router();
const {
  getLessons,
  createLesson,
  getLessonById,
  getPresentaseLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controllers");
const lessonMiddleware = require("../middlewares/lesson.middlewares");
const { isAdmin } = require("../middlewares/admin.midlewares");
const { restrict } = require("../middlewares/auth.middlewares");


router.get("/", isAdmin, getLessons);
router.post("/", lessonMiddleware.validateLessonInput, isAdmin, createLesson);
router.get("/:id", getLessonById);
router.put("/:id", lessonMiddleware.validateLessonInput, isAdmin, updateLesson);
router.delete("/:id", isAdmin, deleteLesson);

router.get("/presentase/:classCode/:id", restrict, getPresentaseLesson);

module.exports = router;
