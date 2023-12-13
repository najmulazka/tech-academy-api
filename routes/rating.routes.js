const router = require("express").Router();
const { createRating } = require("../controllers/rating.controllers");

router.post("/", createRating);

module.exports = router;
