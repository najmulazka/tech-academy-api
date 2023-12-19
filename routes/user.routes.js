const { Router } = require('express');
const { getUserById, updateUser, deleteUser } = require('../controllers/user.controllers');
const { image } = require('../utils/libs/multer.libs');
const authMiddleware = require('../middlewares/auth.middlewares');

const router = Router();

router.get('/', authMiddleware.restrict, getUserById);
router.put('/', authMiddleware.restrict, image.single('profilePicture'), updateUser);
router.delete('/', authMiddleware.restrict, deleteUser);

module.exports = router;
