// models/Timetable.js
const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  room: String,
  day: String,
  slot: String,
  department: String,
  room: String,
  
  subjectCode: String,
  subjectName: String,
  teacher: String,
  branch: String,
  section:String
});

module.exports = mongoose.model("Timetable", timetableSchema);