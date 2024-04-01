const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({ 
  label: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  subCategories: [
    new mongoose.Schema({ 
      route: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
    })
  ],
});

const CategoriesCollection = new mongoose.model(
  "categories_collection",
  categoriesSchema
);

module.exports = CategoriesCollection;
