const router = require("express").Router();
const { changePassword } = require('../controllers/auth.controllers');

router.post('/change-password', changePassword);

module.exports = router;
