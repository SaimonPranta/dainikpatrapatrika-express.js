const router = require("express").Router()
const CategoriesCollection = require("../../../DB/Modals/categories")

router.get("/", async (req, res) => {
  try {

    const categoriesList = await CategoriesCollection.find()
    res.json({
      success: true,
      data: categoriesList,
      message: "Categories updated successfully"
    })
  } catch (error) {
    console.log("error", error)
    res.json({
      message: "Internal server error"
    })
  }
})

router.post("/", async (req, res) => {
  try {
    const data = req.body


    let updateCategories = null;

    if (data.categoriesID) {
      updateCategories = await CategoriesCollection.findOneAndUpdate({ _id: data.categoriesID }, {
        $push: { subCategories: { $each: [data] } }
      }, { new: true })
    } else {
      const categories = await new CategoriesCollection({ ...data })
      updateCategories = await categories.save()

      console.log("updateCategories", updateCategories)
      if (!updateCategories) {
        return res.json({
          success: false,
          message: "Failed to update categories"
        })
      }

    }

    res.json({
      success: true,
      data: updateCategories,
      message: "Categories updated successfully"
    })
  } catch (error) {
    console.log("error", error)
    res.json({
      message: "Internal server error"
    })
  }
})
router.delete("/", async (req, res) => {
  try {
    const { mainID } = req.body;
    console.log("req.body", req.body)
    await CategoriesCollection.findOneAndDelete({ _id: mainID })
    const users = await CategoriesCollection.find()
    res.json({
      success: false,
      data: users
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Internal server error"
    })
  }
})
router.delete("/subcategories", async (req, res) => {
  try {
    const { mainID, subID } = req.body
    console.log("req.body", { mainID, subID })

    await CategoriesCollection.findOneAndUpdate({ _id: mainID }, {
      $pull: {
        subCategories: { _id: subID }
      }
    }, { new: true })
    const users = await CategoriesCollection.find()
    res.json({
      success: false,
      data: users
    })
  } catch (error) {
    console.log("Error ===>>", error)
    res.json({
      success: false,
      message: "Internal server error"
    })
  }
})

module.exports = router