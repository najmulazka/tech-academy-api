const router = require("express").Router();
const auth = require("./auth.routes");
const classs = require("./class.routes");
const categories = require("./category.routes");
const { restrict } = require("../middlewares/auth.middlewares");

router.use("/auth", auth);
router.use("/class", classs);
router.use("/category", categories);

module.exports = router;
