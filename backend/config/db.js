const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/beyondchats");
    
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error", error);
  }
}

module.exports = connectDB;
