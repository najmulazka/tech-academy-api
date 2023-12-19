const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/admin.user.controllers");
const { image } = require('../utils/libs/multer.libs');


const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", image.single('profilePicture'), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
