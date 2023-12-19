const router = require("express").Router();
const {createNotifications, createNotification, getNotifications, getNotificationById, updateNotification, deleteNotification} = require('../controllers/notif.controllers');
const { isAdmin } = require("../middlewares/admin.midlewares");

router.post('/all', isAdmin, createNotifications);
router.post('/', isAdmin, createNotification);
router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.put('/:id', isAdmin, updateNotification);
router.delete('/:id', isAdmin, deleteNotification);

module.exports = router;