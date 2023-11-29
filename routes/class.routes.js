const router = require('express').Router();
const { createClass, getAllClass } = require('../controllers/class.controllers');
const { image } = require('../utils/libs/multer.libs');

router.post('/', image.single('thumbnailPicture'), createClass);
router.get('/', getAllClass);

module.exports = router;
