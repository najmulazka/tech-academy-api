const router = require("express").Router();
const {
  createClass,
  getAllClass,
  getByIdClass,
  updateClass,
  deleteClass,
} = require("../controllers/class.controllers");
const { isAdmin } = require("../middlewares/admin.midlewares");
const { image } = require("../utils/libs/multer.libs");

router.post("/", isAdmin, image.single("thumbnailPicture"), createClass);
router.get("/", getAllClass);
router.get("/:classCode", getByIdClass);
router.put("/:classCode", isAdmin, updateClass);
router.delete("/:classCode", isAdmin, deleteClass);

module.exports = router;
