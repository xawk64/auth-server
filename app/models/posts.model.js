const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
      data: [
        {text: String,
        likesCount: Number,
        likeProfileId: Array
        }
      ]
    })
)

module.exports = Post;