const express = require('express');
const router = express.Router();
const {updateProgres} = require('../controllers/learning.controllers');
const { restrict } = require('../middlewares/auth.middlewares');

// Endpoint untuk mengubah status inProgress pada kelas
router.get('/:classCode', restrict, updateProgres);

module.exports = router;
