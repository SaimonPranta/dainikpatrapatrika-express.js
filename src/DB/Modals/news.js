const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  img: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
  },
  viewCount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const NewsCollection = new mongoose.model(
  "news",
  newsSchema
);

module.exports = NewsCollection;
