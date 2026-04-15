// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["SYSTEM_ADMIN", "DEPT_ADMIN"]
  },
  department: String
});

module.exports = mongoose.model("User", userSchema);