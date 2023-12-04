const router = require("express").Router();
const {
  createCategory,
  getCategory,
  getByIdCategory,
  updateCategory,
  deletedCategory,
} = require("../controllers/category.controllers");
const { image } = require("../utils/libs/multer.libs");

router.post("/", image.single("thumbnailPictureCategory"), createCategory);
router.get("/", getCategory);
router.get("/:id", getByIdCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deletedCategory);

module.exports = router;
