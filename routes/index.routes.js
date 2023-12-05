const router = require('express').Router();
const auth = require('./auth.routes');
const classs = require('./class.routes');
const categories = require('./category.routes');
const chapter = require('./chapter.routes');
const payment = require('./payment.routes');
const lesson = require('./lesson.routes');

// const admin = require('./admin.routes');
// const { admin } = require('../middlewares/admin.midlewares');
const { restrict } = require('../middlewares/auth.middlewares');

router.use('/auth', auth);
router.use('/class', classs);
router.use('/category', categories);
router.use('/chapter', chapter);
// router.use('/admin', admin);
router.use('/payment', restrict, payment);
router.use('/lesson', lesson)

module.exports = router;
