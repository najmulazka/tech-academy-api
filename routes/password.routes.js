const { changePassword } = require('../controllers/auth.controllers');
const router = require('./auth.routes');

router.post('/change-password', changePassword);

module.exports = router;
