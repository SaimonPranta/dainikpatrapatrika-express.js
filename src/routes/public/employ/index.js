const EmployCollection = require("../../../DB/Modals/employ")

const router = require("express").Router()

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const data = await EmployCollection.findOne({ idNumber: id })
        res.json({
            data: data
        })
    } catch (error) {
        res.json({
            message: "Internal server error"
        })
    }
})

module.exports = router