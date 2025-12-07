const jwt = require("jsonwebtoken");
const users = require("../models/user");

const secret = "MY_SECRET_KEY";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, secret, { expiresIn: "1h" });
}

module.exports = { authenticateToken, generateToken, secret, users };
