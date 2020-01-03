// Dependencies
const mongoose = require("mongoose");

// Define our schema
let Schema = mongoose.Schema;

// Construct our schema
let CommentSchema = new Schema({
  commentName: {
    type: String,
    default: "Anonymous"
  },
  commentBody: {
    type: String,
    min: [0],
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }
});

// Create our model
let Comment = mongoose.model("Comment", CommentSchema);

// Export said model
module.exports = Comment;
