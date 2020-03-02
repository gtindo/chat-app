const userHandlers = require('../handlers/user');
const xmpp = require('../xmpp');

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
      socket.emit("register", JSON.stringify(res));
    });

    socket.on("login", async (data) => {
      let res = await userHandlers.login(data);
      
      if(res.status === true){
        socket.join(res.data.username);
        let clients = io.nsps["/"].adapter.rooms[res.data.username].length;
        if(clients === 1) {
          let xmppConn = xmpp.createXmppConnection(res.data.username, res.data.password); // create
          xmpp.listenXmpp(xmppConn, io, res.data.username);
        };
      };
    });

    socket.emit("login", JSON.stringify(res));
  });
}

// Should save on redis without validation registration