const router = require("express").Router();
const {
  createClass,
  getAllClass,
  getByIdClass,
  updateClass,
} = require("../controllers/class.controllers");
const { image } = require("../utils/libs/multer.libs");

router.post("/", image.single("thumbnailPicture"), createClass);
router.get("/", getAllClass);
router.get("/:classCode", getByIdClass);
router.put("/:classCode", updateClass);

module.exports = router;
