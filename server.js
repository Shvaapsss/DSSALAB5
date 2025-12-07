const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const { authenticateSocket } = require("./ws/socket");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(bodyParser.json());

// REST API routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Global error handler
app.use(errorHandler);

// WebSocket
io.use(authenticateSocket); // проверка JWT при соединении
io.on("connection", (socket) => {
  console.log("Пользователь подключился:", socket.user.username);

  socket.on("message", (data) => {
    io.emit("message", `${socket.user.username}: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился:", socket.user.username);
  });
});

// Start server
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
