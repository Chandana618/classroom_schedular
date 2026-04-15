// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/timetable", require("./routes/timetable"));

app.listen(5000, () => console.log("Server running"));

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});
const Timetable = require("./models/Timetable");

app.get("/seed-data", async (req, res) => {
  await Timetable.deleteMany(); // clear old data

  const sample = [
    { day: "Mon", slot: "L1", department: "IT", subjectName: "DS" },
    { day: "Mon", slot: "L2", department: "CSE", subjectName: "OS" },
    { day: "Tue", slot: "L1", department: "IT", subjectName: "DBMS" },
    { day: "Wed", slot: "L3", department: "ECE", subjectName: "Signals" }
  ];

  await Timetable.insertMany(sample);

  res.send("Sample data added ✅");
});

app.use("/api/upload", require("./routes/upload"));