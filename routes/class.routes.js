const router = require('express').Router();
const { createClass } = require('../controllers/class.controllers');
const { image } = require('../utils/libs/multer.libs');

router.post('/', image.single('thumbnailPicture'), createClass);

module.exports = router;
