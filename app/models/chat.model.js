const mongoose = require("mongoose");

const Chat = mongoose.model(
  "Chat",
  new mongoose.Schema({
    messages: [{text: String,
          author: String,
          date: String
    }]
    ,
      members: Array
    })
)

module.exports = Chat;