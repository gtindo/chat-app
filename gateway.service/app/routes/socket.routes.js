const userHandlers = require('../handlers/user');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log("A client connected");

    // Test connexion socket
    socket.on("pingMsg", (message) => {
      socket.emit("pongMsg", "pong");
    });

    // Create new user
    socket.on("register", async (data) => {
      socket.emit("register", await userHandlers.register(data));
    });
  });
}

// Should save on redis without validation registration