// Dependencies
const mongoose = require("mongoose");

// Schema Reference
const Schema = mongoose.Schema;

// New Schema via Constructor
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  articleURL: {
    type: String,
    required: true,
    unique: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Create our Model
let Article = mongoose.model("Article", ArticleSchema);

// Export our Model
module.exports = Article;
