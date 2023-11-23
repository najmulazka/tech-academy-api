const router = require('express').Router();
const { login } = require('../controllers/auth.controllers');

router.post('/login', login);

module.exports = router;
