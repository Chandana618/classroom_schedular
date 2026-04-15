// routes/auth.js
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role, department: user.department },
    process.env.JWT_SECRET
  );

  res.json({ token, user: {
    role: user.role,
    department: user.department,
    email: user.email
  } });
});



// TEMP ROUTE TO CREATE USERS
router.get("/create-admins", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.deleteMany(); // clear old users (optional)

    await User.insertMany([
      {
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "SYSTEM_ADMIN"
      },
      {
        email: "it@gmail.com",
        password: hashedPassword,
        role: "DEPT_ADMIN",
        department: "IT"
      },
      {
    email: "cse@gmail.com",
    password: hashedPassword,
    role: "DEPT_ADMIN",
    department: "CSE"
  },
  {
    email: "ece@gmail.com",
    password: hashedPassword,
    role: "DEPT_ADMIN",
    department: "ECE"
  }
    ]);

    res.send("Admins created ✅");
  } catch (err) {
    console.log(err);
    res.send("Error creating users");
  }
});
module.exports = router;