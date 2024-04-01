const router = require("express").Router()

router.use("/categories", require("./categories/index"))
router.use("/news", require("./news/index"))

module.exports = router