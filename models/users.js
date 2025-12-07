const bcrypt = require("bcrypt");

const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: bcrypt.hashSync("AdminPass123", 10),
    role: "admin"
  },
  {
    id: 2,
    username: "user",
    email: "user@example.com",
    password: bcrypt.hashSync("UserPass123", 10),
    role: "user"
  }
];

module.exports = users;
