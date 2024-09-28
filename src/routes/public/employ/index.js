const EmployCollection = require("../../../DB/Modals/employ")

const router = require("express").Router()

router.post("/", async (req, res) => {
    try {
        const { name, idNumber } = req.body
        console.log("red.body", req.body)
        if (!name || !idNumber) {
            res.json({
                message: "User doesn't match"
            })
        }
        const data = await EmployCollection.find({ name, idNumber })
        console.log("data ==>>", data)
        res.json({
            data: data
        })
    } catch (error) {
        res.json({
            message: "Internal server error"
        })
    }
})

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