const router = require("express").Router()

router.use("/categories", require("./categories/index"))
router.use("/news", require("./news/index"))
router.use("/auth", require("./auth/index"))

module.exports = router