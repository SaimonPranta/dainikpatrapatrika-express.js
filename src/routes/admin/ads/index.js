const router = require("express").Router()
const getRandomNumber = require('../../../shared/functions/getRandomNumber');
const AdsCollection = require("../../../DB/Modals/ads")
const path = require('path');
const { storageRootPath } = require("../../../shared/constants/variables");
const adsStorePath = path.join(storageRootPath, "ads")
const fs = require("fs")
const { getQueries } = require("./utilities")

router.get("/", async (req, res) => {
  try {
    const limit = 24
    const page = req.query.page || 1
    const search = req.query.search
    const id = req.query.id
    const query = getQueries(search)
    const totalNews = await AdsCollection.countDocuments()
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

    let adsList = []

    if (id) {
      adsList = await AdsCollection.findOne({ _id: id })
    } else if (search) {
      adsList = await AdsCollection.find(query).limit(limit)
    } else {
      adsList = (await AdsCollection.find({}).skip(skip).limit(limit)).reverse()
    }


    res.json({
      data: adsList,
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

    const adsInfo = await new AdsCollection({ ...data, img: [image.name] })
    const updateAds = await adsInfo.save()

    if (!updateAds) {
      return res.json({
        success: false,
        message: "Failed to create a ads"
      })
    }
    if (!fs.existsSync(adsStorePath)) {
      await fs.mkdirSync(adsStorePath)
    }
    const imgFilePath = path.join(adsStorePath, updateAds.img[0])
    await image.mv(imgFilePath)

    res.json({
      success: true,
      data: updateAds,
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
    let updateAds = null
    if (image) {
      image = req.files?.img
      const imageExt = path.extname(image.name)
      const imageName = `${image.name.replace(imageExt, "")}_${Date.now()}${getRandomNumber()}${imageExt}`
      image.name = imageName
      updateAds = await AdsCollection.findOneAndUpdate({ _id: data._id }, { ...data, img: [image.name] }, { new: true })

      await Promise.all(data.img.map(async (img) => {
        const imgPath = path.join(adsStorePath, img)
        if (fs.existsSync(imgPath)) {
          await fs.unlinkSync(imgPath)
        }
      }))
      if (!fs.existsSync(adsStorePath)) {
        await fs.mkdirSync(adsStorePath)
      }
      const imgFilePath = path.join(adsStorePath, updateAds.img[0])
      await image.mv(imgFilePath)

    } else {
      const newsInfo = await new AdsCollection({ ...data })
      updateAds = await AdsCollection.findOneAndUpdate({ _id: data._id }, { ...data }, { new: true })
    }

    if (!updateAds) {
      return res.json({
        success: false,
        message: "Failed to create a ads"
      })
    }

    res.json({
      success: true,
      data: updateAds,
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

    const deleteInfo = await AdsCollection.findOneAndDelete({ _id: id })
    await Promise.all(deleteInfo.img.map(async (img) => {
      const imgPath = path.join(adsStorePath, img)
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
