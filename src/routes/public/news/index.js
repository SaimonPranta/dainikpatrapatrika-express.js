const CategoriesCollection = require("../../../DB/Modals/categories");
const NewsCollection = require("../../../DB/Modals/news")

const router = require("express").Router()

router.get("/", async (req, res) => {
    try {
        const { category, subcategory } = req.query;
        const limit = Number(req.query.limit) || 20;
        console.log("req.query ==>>", req.query)
        const query = {}
        if (category && category !== "undefined") {
            query["category"] = category
        }
        if (subcategory && subcategory !== "undefined") {
            query["subcategory"] = subcategory
        }
        console.log("query ==>>", query)

        const news = await NewsCollection.find({ ...query }).limit(limit).sort({ createdAt: -1 })
        console.log("news ==>>", news.length)
        res.json({
            success: true,
            data: news
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

        const news = await NewsCollection.findOne({ _id: id })
        if (news.category) {
            const categories = await CategoriesCollection.findOne({ label: news.category })
            news._doc["categoriesRoute"] = categories.route
            if (news.subcategory) {
                const subcategoryInfo = await categories?.subCategories?.find(routeInfo => routeInfo.label === news.subcategory);
                if (subcategoryInfo) {
                    news._doc["subCategoriesRoute"] = subcategoryInfo.route
                }
            }
        }

        res.json({
            success: true,
            data: news
        })
    } catch (error) {
        res.json({
            message: "Internal server error"
        })
    }
})

module.exports = router