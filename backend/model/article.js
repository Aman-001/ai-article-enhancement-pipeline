const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  link: String,
  content: String,


  references: [String],

  isUpdated: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Article", articleSchema);
