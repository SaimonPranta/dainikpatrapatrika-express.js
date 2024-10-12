const router = require("express").Router()

router.use("/categories", require("./initial/index"))
router.use("/news", require("./news/index"))
router.use("/employ", require("./employ/index"))

module.exports = router