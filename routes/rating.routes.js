const router = require("express").Router();
const { createRating } = require("../controllers/rating.controllers");

router.post("/:classCode", createRating);

module.exports = router;
