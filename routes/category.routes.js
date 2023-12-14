const router = require("express").Router();
const {
  createCategory,
  getCategory,
  getByIdCategory,
  updateCategory,
  deletedCategory,
} = require("../controllers/category.controllers");
const { isAdmin } = require("../middlewares/admin.midlewares");
const { image } = require("../utils/libs/multer.libs");

router.post("/", isAdmin, image.single("thumbnailPictureCategory"), createCategory);
router.get("/", getCategory);
router.get("/:id", getByIdCategory);
router.put("/:id", isAdmin, updateCategory);
router.delete("/:id", isAdmin, deletedCategory);

module.exports = router;
