const express = require('express');
const router = express.Router();
const {getAllLearning, getLearningById} = require('../controllers/learning.controllers');
const { restrict } = require('../middlewares/auth.middlewares');

// Endpoint untuk mengubah status inProgress pada kelas
// router.get('/:classCode', restrict, updateProgres);

router.get('/',  getAllLearning);
router.get('/:id', getLearningById);

module.exports = router;
