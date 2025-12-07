const express = require("express");
const { todos } = require("../models/todo");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Get todos
router.get("/", authenticateToken, (req, res) => {
  if (req.user.role === "admin") {
    res.json(todos);
  } else {
    res.json(todos.filter(t => t.userId === req.user.id));
  }
});

// Create todo
router.post("/", authenticateToken, (req, res) => {
  const { title, description } = req.body;
  const newTodo = { id: todos.length + 1, title, description, userId: req.user.id };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

module.exports = router;
