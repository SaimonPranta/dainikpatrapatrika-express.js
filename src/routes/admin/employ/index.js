const router = require("express").Router()
const getRandomNumber = require('../../../shared/functions/getRandomNumber');
const NewsCollection = require("../../../DB/Modals/news")
const EmployCollection = require("../../../DB/Modals/employ")
const path = require('path');
const { storageRootPath } = require("../../../shared/constants/variables");
const employStorePath = path.join(storageRootPath, "employ")
const fs = require("fs")
const { getQueries } = require("./utilities")

router.get("/", async (req, res) => {
  try {
    const limit = 24
    const page = req.query.page || 1
    const search = req.query.search
    const id = req.query.id
    let query = {
      $or: [
        {
          name: new RegExp(search, "i")
        },
        {
          email: new RegExp(search, "i")
        },
        {
          idNumber: new RegExp(search, "i")
        },
      ]
    }
    const totalNews = await EmployCollection.countDocuments()
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

    if (id) {
      newList = await EmployCollection.findOne({ _id: id })
    } else if (search) {
      newList = await EmployCollection.find(query).limit(limit)
    } else {
      newList = (await EmployCollection.find({}).skip(skip).limit(limit)).reverse()
    }


    res.json({
      data: newList,
    })
  } catch (error) {
    res.json({
      message: "Internal server error"
    })
  }
})

router.post("/", async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    let image = req.files.img

    console.log("hello")

    const imageExt = path.extname(image.name)
    const imageName = `${image.name.replace(imageExt, "")}_${Date.now()}${getRandomNumber()}${imageExt}`
    image.name = imageName

    const employInfo = await new EmployCollection({ ...data, profilePicture: image.name })
    const updateNews = await employInfo.save()

    if (!updateNews) {
      return res.json({
        success: false,
        message: "Failed to create a employ"
      })
    }
    if (!fs.existsSync(employStorePath)) {
      await fs.mkdirSync(employStorePath)
    }
    const imgFilePath = path.join(employStorePath, updateNews.profilePicture)
    await image.mv(imgFilePath)

    res.json({
      success: true,
      data: updateNews,
      message: "Categories updated successfully"
    })
  } catch (error) {
    console.log("error ==>>", error)
    res.json({
      message: "Internal server error"
    })
  }
})
router.put("/", async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    let image = req.files
    let updateNews = null
    if (image) {
      image = req.files?.img
      const imageExt = path.extname(image.name)
      const imageName = `${image.name.replace(imageExt, "")}_${Date.now()}${getRandomNumber()}${imageExt}`
      image.name = imageName
      updateNews = await NewsCollection.findOneAndUpdate({ _id: data._id }, { ...data, img: [image.name] }, { new: true })

      await Promise.all(data.img.map(async (img) => {
        const imgPath = path.join(employStorePath, img)
        if (fs.existsSync(imgPath)) {
          await fs.unlinkSync(imgPath)
        }
      }))
      if (!fs.existsSync(employStorePath)) {
        await fs.mkdirSync(employStorePath)
      }
      const imgFilePath = path.join(employStorePath, updateNews.img[0])
      await image.mv(imgFilePath)

    } else {
      const newsInfo = await new NewsCollection({ ...data })
      updateNews = await NewsCollection.findOneAndUpdate({ _id: data._id }, { ...data }, { new: true })
    }






    if (!updateNews) {
      return res.json({
        success: false,
        message: "Failed to create a news"
      })
    }

    res.json({
      success: true,
      data: updateNews,
      message: "Categories updated successfully"
    })
  } catch (error) {
    res.json({
      message: "Internal server error"
    })
  }
})
router.delete("/", async (req, res) => {
  try {
    const { id } = req.query;

    const deleteInfo = await EmployCollection.findOneAndDelete({ _id: id })
   
    const imgPath = path.join(employStorePath, deleteInfo.profilePicture)
    if (fs.existsSync(imgPath)) {
      await fs.unlinkSync(imgPath)
    }
    res.json({
      data: true
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Internal server error"
    })
  }
})



module.exports = router
