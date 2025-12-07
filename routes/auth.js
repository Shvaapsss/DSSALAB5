const express = require("express");
const bcrypt = require("bcrypt");
const { users, generateToken } = require("../middlewares/auth");

const router = express.Router();

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token });
});

module.exports = router;
