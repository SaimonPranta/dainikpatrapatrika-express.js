const mongoose = require("mongoose");

const employSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  joinDate: {
    type: Date,
    required: true
  },
  idCardExpDate: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  panelAccess: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const EmployCollection = new mongoose.model(
  "employ",
  employSchema
);

module.exports = EmployCollection;
