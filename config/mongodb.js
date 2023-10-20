const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    console.log(process.env.MONGO);
    const conn = await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
