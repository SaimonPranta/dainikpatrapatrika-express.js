const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const URI = "mongodb://localhost:27017/dainikpatrapatrika"
// const URI = `mongodb+srv://dainikpatrapatrika:${process.env.DB_PASSWORD}@cluster0.xlxskky.mongodb.net/dainikpatrapatrika?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set("strictQuery", false);
mongoose.connect(URI).then((success) => {
  console.log("successfully connected with database.");
});
