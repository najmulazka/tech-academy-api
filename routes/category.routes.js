const router = require("express").Router();
const {
  createCategory,
  getCategory,
  getByIdCategory,
  updateCategory,
} = require("../controllers/category.controllers");

router.post("/", createCategory);
router.get("/", getCategory);
router.get("/:id", getByIdCategory);
router.put("/:id", updateCategory);

module.exports = router;
