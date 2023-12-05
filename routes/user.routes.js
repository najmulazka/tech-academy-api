const router= require("express").Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/user.controllers");
const { image } = require('../utils/libs/multer.libs');

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", image.single('profilePicture'), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
