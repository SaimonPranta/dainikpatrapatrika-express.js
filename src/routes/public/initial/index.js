const CategoriesCollection = require("../../../DB/Modals/categories")

const router = require("express").Router()

router.get("/", async (req, res) => {
  try {

    const categoriesList = await CategoriesCollection.find()

    res.json({
      success: true,
      data: categoriesList
    })
  } catch (error) { 
    res.json({
      message: "Internal server error"
    })
  }
})
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params
    const { subCategory } = req.query
    const query = {
      route: category
    }
    if (subCategory !== "undefined") {
      query["subCategories.route"] = subCategory
    }

    const categoryInfo = await CategoriesCollection.findOne(query) 
    const finalInfo = {}
    if (categoryInfo?.label) {
      finalInfo["categoryLabel"] = categoryInfo.label
      const findItem = await categoryInfo?.subCategories?.find((item) => item.route.trim() === subCategory.trim())
      if (findItem && subCategory !== "undefined") {
        finalInfo["subCategoryLabel"] = findItem.label
      }
    }

    res.json({
      success: true,
      data: finalInfo
    })
  } catch (error) { 
    res.json({
      message: "Internal server error"
    })
  }
})

module.exports = router