const jwt = require("jsonwebtoken");
const { secret, users } = require("../middlewares/auth");

// Middleware для WebSocket соединений
function authenticateSocket(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Token missing"));

  jwt.verify(token, secret, (err, user) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = users.find(u => u.id === user.id);
    next();
  });
}

module.exports = { authenticateSocket };
