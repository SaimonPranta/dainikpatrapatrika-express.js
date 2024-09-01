const CategoriesCollection = require("../../../DB/Modals/categories");
const NewsCollection = require("../../../DB/Modals/news")

const router = require("express").Router()

router.get("/", async (req, res) => {
    try {
        const { category, subcategory, search, sort } = req.query;

        console.log("sort =>", sort)
        const limit = Number(req.query.limit) || 20;
        const query = {}
        if (category && category !== "undefined") {
            query["category"] = category
        }
        if (subcategory && subcategory !== "undefined") {
            query["subcategory"] = subcategory
        }
        if (search && search !== "undefined") {
            query["$or"] = [{ title: new RegExp(search, "i") }, { description: new RegExp(search, "i") }]
        }
        const news = await NewsCollection.find({ ...query }).limit(limit).sort({ createdAt: -1 })

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

router.get("/sort", async (req, res) => {
    try {
        const { sort } = req.query;

        console.log("sort =>", sort)
        const limit = 24
        const page = req.query.page || 1
        const totalNews = await NewsCollection.countDocuments()
        let newsSlice = totalNews / limit
        if (newsSlice.toString().includes(".")) {
            const [beforeDot, afterDot] = newsSlice.toString().split(".")
            if (Number(afterDot) > 0) {
                newsSlice = Number(beforeDot) + 1
            }

        }

        
        if (newsSlice < page) {
            return res.json({
                message: "All news are already loaded",
            })
        }
        const skip = (newsSlice - page) * limit

        

        let newList = []
        if (sort === 'সর্বশেষ') {
            newList = (await NewsCollection.find({}).skip(skip).limit(limit).sort({ createdAt: 1 }).select("title img")).reverse()
        } else if(sort === "জনপ্রিয়") {
            newList = (await NewsCollection.find({}).skip(skip).limit(limit).sort({ viewCount: 1 }).select("title img viewCount")).reverse()
        }

console.log("newList",newList.length)
console.log({
    newsSlice, page,skip,newList: newList.length, limit
})

        res.json({
            data: newList,
            page: page
        })
    } catch (error) {
        console.log("error==>>", error)
        res.json({
            message: "Internal server error"
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        console.log("id ==>>", id)

        const news = await NewsCollection.findOneAndUpdate(
            { _id: id },
            { $inc: { viewCount: 1 } },
            { new: true }
        );

        console.log("news=>", news)
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
        console.log("error =>", error)
        res.json({
            message: "Internal server error"
        })
    }
})

module.exports = router