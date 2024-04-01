const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const URI = "mongodb://localhost:27017/dainikpatrapatrika"
mongoose.set("strictQuery", false);
mongoose.connect(URI).then((success) => {
  console.log("successfully connected with database.");
});