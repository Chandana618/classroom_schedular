// routes/timetable.js
const router = require("express").Router();
const Timetable = require("../models/Timetable");
const auth = require("../middleware/auth");

router.put("/update", async (req, res) => {
  const { day, slot } = req.body;

   try {
    const updated = await Timetable.findOneAndUpdate(
      { day, slot },
      req.body,
      { new: true, upsert: true } // 🔥 VERY IMPORTANT
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", auth, async (req, res) => {
  const cell = await Timetable.findById(req.params.id);

  if (
    req.user.role !== "SYSTEM_ADMIN" &&
    req.user.department !== cell.department
  ) {
    return res.status(403).json({ msg: "Access denied" });
  }

  if (req.user.role === "DEPT_ADMIN") {
    const allowed = ["subjectCode", "subjectName", "teacher", "section"];

    allowed.forEach(field => {
      if (req.body[field]) cell[field] = req.body[field];
    });
  } else {
    Object.assign(cell, req.body);
  }

  await cell.save();
  res.json(cell);
});

module.exports = router;

router.get("/", async (req, res) => {
  const data = await Timetable.find();
  res.json(data);
});

router.delete("/delete", async (req, res) => {
  const { day, slot } = req.query;

  try {
    await Timetable.findOneAndDelete({ day, slot });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});