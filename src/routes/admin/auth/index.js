const router = require("express").Router()
const AdminCollection = require("../../../DB/Modals/admin")
const jwt = require("jsonwebtoken")


router.get("/check-token", async (req, res) => {
    try {
        let token = req.headers?.authorization?.split(" ")
        if (!token || !token[1]) {

        }
        token = token[1]

        const { mail } = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (mail) {
            const admin = await AdminCollection.findOne({ mail }).select("mail")
            console.log("admin =>", admin)
            if (admin) {
                return res.json({ verified: true, admin })
            }
        }

        res.json({ message: "Unauthorized attempt" })
    } catch (error) {
        console.log("error =>", error)
        res.json({ message: "Internal server error" })
    }
})
router.post("/", async (req, res) => {
    try {
        const { mail, password } = req.body;
        const data = await AdminCollection.findOne({
            mail, password
        })
        const token = await jwt.sign({
            mail
        }, process.env.JWT_SECRET_KEY,
            { expiresIn: "3d" })
        res.json({ data, token })
    } catch (error) {
        console.log("error =>", error)
        res.json({ message: "Internal server error" })
    }
})

module.exports = router