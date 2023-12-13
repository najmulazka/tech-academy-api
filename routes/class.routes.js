const router = require("express").Router();
const {
  createClass,
  getAllClass,
  getByIdClass,
  getIdClassProgress,
  updateClass,
  deleteClass,
} = require("../controllers/class.controllers");
const { image } = require("../utils/libs/multer.libs");
const { restrict } = require("../middlewares/auth.middlewares");

router.post("/", image.single("thumbnailPicture"), createClass);
router.get("/", getAllClass);
router.get("/:classCode", getByIdClass); 
router.get("/inprogress/:classCode", restrict, getIdClassProgress);  
router.put("/:classCode", updateClass);
router.delete("/:classCode", deleteClass);

module.exports = router;
