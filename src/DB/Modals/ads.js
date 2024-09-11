const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  targetLink: {
    type: String,
  },
  img: {
    type: Array,
    required: true,
  },
  viewCount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const AdsCollection = new mongoose.model(
  "ads",
  adsSchema
);

module.exports = AdsCollection;
