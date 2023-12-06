const express = require("express");
const router = express.Router();
const {
  getLessons,
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controllers");
const lessonMiddleware = require("../middlewares/lesson.middlewares");

router.get("/", getLessons);
router.post("/", lessonMiddleware.validateLessonInput, createLesson);
router.get("/:id", getLessonById);
router.put("/:id", lessonMiddleware.validateLessonInput, updateLesson);
router.delete("/:id", deleteLesson);

module.exports = router;
