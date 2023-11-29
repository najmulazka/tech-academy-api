const router = require("express").Router();
const {
  createCategory,
  getCategory,
  getByIdCategory,
  updateCategory,
} = require("../controllers/category.controllers");

router.post("/category", createCategory);
router.get("/category", getCategory);
router.get("/category/:id", getByIdCategory);
router.put("/category/:id", updateCategory);

module.exports = router;
