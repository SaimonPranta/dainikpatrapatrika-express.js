const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  mail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "Admin"
  }
}, {
  timestamps: true
});

const AdminCollection = new mongoose.model(
  "admin",
  adminSchema
);

module.exports = AdminCollection;
