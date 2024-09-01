const router = require("express").Router()
const getRandomNumber = require('../../../shared/functions/getRandomNumber');
const NewsCollection = require("../../../DB/Modals/news")
const path = require('path');
const { storageRootPath } = require("../../../shared/constants/variables");
const newsStorePath = path.join(storageRootPath, "news")
const fs = require("fs")
const { getQueries } = require("./utilities")


router.get("/", async (req, res) => {
  try {
    const limit = 24
    const page = req.query.page || 1
    const search = req.query.search
    const id = req.query.id
    const query = getQueries(search)
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

    if (id) {
      newList = await NewsCollection.findOne({ _id: id })
    } else if (search) {
      newList = await NewsCollection.find(query).limit(limit)
    } else {
      newList = (await NewsCollection.find({}).skip(skip).limit(limit)).reverse()
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

    const imageExt = path.extname(image.name)
    const imageName = `${image.name.replace(imageExt, "")}_${Date.now()}${getRandomNumber()}${imageExt}`
    image.name = imageName

    const newsInfo = await new NewsCollection({ ...data, img: [image.name] })
    const updateNews = await newsInfo.save()

    if (!updateNews) {
      return res.json({
        success: false,
        message: "Failed to create a news"
      })
    }
    if (!fs.existsSync(newsStorePath)) {
      await fs.mkdirSync(newsStorePath)
    }
    const imgFilePath = path.join(newsStorePath, updateNews.img[0])
    await image.mv(imgFilePath)

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
        const imgPath = path.join(newsStorePath, img)
        if (fs.existsSync(imgPath)) {
          await fs.unlinkSync(imgPath)
        }
      }))
      if (!fs.existsSync(newsStorePath)) {
        await fs.mkdirSync(newsStorePath)
      }
      const imgFilePath = path.join(newsStorePath, updateNews.img[0])
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

    const deleteInfo = await NewsCollection.findOneAndDelete({ _id: id })
    await Promise.all(deleteInfo.img.map(async (img) => {
      const imgPath = path.join(newsStorePath, img)
      if (fs.existsSync(imgPath)) {
        await fs.unlinkSync(imgPath)
      }
    }))
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
