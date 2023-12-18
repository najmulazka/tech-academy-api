const router = require("express").Router();
const auth = require("./auth.routes");
const user = require("./user.routes");
const password = require("./password.routes");
const classs = require("./class.routes");
const categories = require("./category.routes");
const chapter = require("./chapter.routes");
const payment = require("./payment.routes");
const paymentAdmin = require("./admin.payment.routes");
const admin = require("./admin.user.routes");
const notifications = require("./notif.routes");
const rating = require("./rating.routes");
const { restrict } = require("../middlewares/auth.middlewares");
const { isAdmin } = require("../middlewares/admin.midlewares");
const lesson = require('./lesson.routes');
const learning = require('./learning.routes');

// const admin = require('./admin.routes');
// const { admin } = require('../middlewares/admin.midlewares');

router.use('/auth', auth);
router.use('/user', user);
router.use('/password', restrict, password);
router.use('/class', classs);
router.use('/category', categories);
router.use('/chapter', chapter);
router.use('/payment', restrict, payment);
router.use('/admin/payment', isAdmin, paymentAdmin);
router.use('/admin/user', isAdmin, admin);
router.use('/notifications', restrict, notifications);
router.use('/lesson', lesson);
router.use('/rating', restrict, rating);
router.use('/learning', learning)
router.use('/bank', isAdmin, bank);

module.exports = router;
