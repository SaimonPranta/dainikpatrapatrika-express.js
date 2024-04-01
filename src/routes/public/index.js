const router = require("express").Router()

router.use("/categories", require("./initial/index"))
router.use("/news", require("./news/index"))

module.exports = router