const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    restaurants: [
      {
        name: String,
        tags: []
      }
    ]
  })
);

module.exports = User;
