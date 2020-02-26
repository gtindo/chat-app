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
      let res = await userHandlers.register(data);
      console.log(res);
      socket.emit("register", res);
    });
  });
}

// Should save on redis without validation registration