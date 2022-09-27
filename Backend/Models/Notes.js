const mongoose = require("mongoose");
const { Schema } = mongoose;
const NotesSchema = new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId, //this is like a foreign key
    ref:'user'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    requires: true,
  },
  tag: {
    type: String,
    defaut: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);


// notes name database is created on mongoose