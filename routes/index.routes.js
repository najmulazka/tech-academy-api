const router = require('express').Router();
const auth = require('./auth.routes');
const classs = require('./class.routes');
const categories = require('./category.routes');
const chapter = require('./chapter.routes');
const payment = require('./payment.routes');
const user = require('./user.routes')
const admin = require('./admin.user.routes')
const { restrict } = require("../middlewares/auth.middlewares");

router.use('/auth', auth);
router.use('/class', classs);
router.use('/category', categories);
router.use('/chapter', chapter);
router.use('/payment', restrict, payment);
router.use('/user', user);
router.use('/admin', admin);

module.exports = router;
