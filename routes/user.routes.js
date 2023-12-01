const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/user.controllers");

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
