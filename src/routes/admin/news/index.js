const router = require("express").Router()
const getRandomNumber = require('../../../shared/functions/getRandomNumber');
const NewsCollection = require("../../../DB/Modals/news")
const path = require('path');
const { storageRootPath } = require("../../../shared/constants/variables");
const newsStorePath = path.join(storageRootPath, "news")
const fs = require("fs")

router.get("/", async (req, res) => {
  try { 
    const page = req.query.page || 1
    const search = req.query.search
    const id = req.query.id
    console.log("HEllo form this is")
    const pageCount = await NewsCollection.countDocuments()
console.log("pageCount", pageCount)
    const limit = 5
    const combination = limit * Number(page);
    let skip = pageCount - combination
    console.log("skip", skip)
    
    if (skip < 0) {
      // skip = 0
      // return res.json({
      //   data: [],
      // })
    }
    // let skip = pageCount - combination
    // console.log("skip", skip)
    // if (skip < 0) {
    //   return res.json({
    //     data: [],
    //   })
    // }
    if (skip < limit) {
      skip = 0
    }
    console.log({
      page,
      pageCount,
      combination,
      skip
    })
    let newList = []
    let query = {}
    if (id) {
      newList = await NewsCollection.findOne({ _id: id })

    } else if (search) {
      newList = (await NewsCollection.find({
        $or: [
          {
            title: new RegExp(search, "i")
          },
          {
            category: new RegExp(search, "i")
          },
          {
            subcategory: new RegExp(search, "i")
          },
        ]
      }).skip(skip).limit(limit))

    } else {
      newList = (await NewsCollection.find().skip(skip).limit(limit)).reverse()
    }

    res.json({
      data: newList,
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

    console.log("image", image)
    console.log("data", data)
    if (image) {
      image = req.files?.img
      const imageExt = path.extname(image.name)
      const imageName = `${image.name.replace(imageExt, "")}_${Date.now()}${getRandomNumber()}${imageExt}`
      image.name = imageName
      updateNews = await NewsCollection.findOneAndUpdate({ _id: data._id }, { ...data, img: [image.name] }, {new: true})

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
      updateNews = await NewsCollection.findOneAndUpdate({ _id: data._id }, { ...data }, {new: true})
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