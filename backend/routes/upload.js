const router = require("express").Router();
const multer = require("multer");
const xlsx = require("xlsx");
const Timetable = require("../models/Timetable");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const records = [];

    data.forEach(row => {
      Object.keys(row).forEach(slot => {
        if (slot !== "Day") {
          records.push({
            day: row["Day"],
            slot: slot,
            department: row[slot],
            room:"LHC101"
          });
        }
      });
    });

    await Timetable.deleteMany(); // clear old timetable
    await Timetable.insertMany(records);

    res.json({ msg: "Excel uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

module.exports = router;