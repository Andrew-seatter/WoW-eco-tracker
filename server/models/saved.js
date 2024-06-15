const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
//const dateFormat = require("../utils/dateFormat");

// Basic Example - need to fill out actual schema data
const savedSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
});

const Saved = model("Saved", savedSchema);

module.exports = Saved;
