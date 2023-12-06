const router = require("express").Router();
const notificationController = require('../controllers/notif.controllers');

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;