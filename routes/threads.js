const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var ReplySchema = new Schema({
    text: {
      type: String
    },
    created_on: {
      type: Date
    },
    reported: {
      type: Boolean,
      default: false
    },    
    delete_password: {
      type: String,
    }  
}, {_id: true})

var ThreadsSchema = new Schema({
  board: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date
  },
  bumped_on: {
    type: Date
  },
  reported: {
    type: Boolean,
    default: false
  },
  delete_password: {
    type: String,
    required: true
  }, 
  replies: {
    type: Array,
    value: ReplySchema
  },
  replycount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Threads", ThreadsSchema);