const router = require("express").Router();
const notificationController = require('../controllers/notif.controllers');

router.post('/all', notificationController.createNotifications);
router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;