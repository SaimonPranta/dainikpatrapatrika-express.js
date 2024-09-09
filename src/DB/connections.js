const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const URI3 = `mongodb+srv://dainikpatrapatrika:6KLomrW6qdZUUpCP@cluster0.xlxskky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// const URI = "mongodb://localhost:27017/dainikpatrapatrika"
const URI = `mongodb+srv://dainikpatrapatrika:${process.env.DB_PASSWORD}@cluster0.xlxskky.mongodb.net/dainikpatrapatrika?retryWrites=true&w=majority&appName=Cluster0`
// const URI = `mongodb+srv://dainikpatrapatrika:${process.env.DB_PASSWORD}@cluster0.xlxskky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/dainikpatrapatrika`
mongoose.set("strictQuery", false);
mongoose.connect(URI).then((success) => {
  console.log("successfully connected with database.");
});
