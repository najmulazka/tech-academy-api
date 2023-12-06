const router = require('express').Router();
const auth = require('./auth.routes');
const user = require('./user.routes');
const password = require('./password.routes');
const classs = require('./class.routes');
const categories = require('./category.routes');
const chapter = require('./chapter.routes');
const payment = require('./payment.routes');
const paymentAdmin = require('./admin.payment.routes');
const admin = require('./admin.user.routes')
const { restrict } = require("../middlewares/auth.middlewares");
const { isAdmin } = require("../middlewares/admin.midlewares");
const lesson = require('./lesson.routes');

// const admin = require('./admin.routes');
// const { admin } = require('../middlewares/admin.midlewares');

router.use('/auth', auth);
router.use('/user', user);
router.use('/password', password);
router.use('/class', classs);
router.use('/category', categories);
router.use('/chapter', chapter);
router.use('/payment', restrict, payment);
router.use('/paymentAdmin', isAdmin, paymentAdmin);
router.use('/admin', admin);
router.use('/lesson', lesson)

module.exports = router;
