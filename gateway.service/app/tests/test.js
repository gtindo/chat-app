const assert = require('chai').assert;
const socket = require('socket.io-client')("http://localhost:3000");

/**
 * function used to wait response on a channel
 * 
 * @param {String} channel 
 * @param {Function} callback 
 */
const waitMessage = async (channel, callback) => {
  return new Promise((resolve, reject) => {
    try {
      socket.on(channel, async (data) => {
        await callback(data);
        resolve(data);
      });
    } catch (err) {
      reject(err)
    }
  });
}


/**
 * Fill error message template
 * @param {String} code 
 * @param {String} message 
 */
const formatErrorMsg = (code, message) => {
  return {
    data: {},
    error: { code, message},
    status: false
  }
}


describe('Test Connection', () => {
  it("Should connect, send ping and receive pong", async () => {
    socket.emit("pingMsg", "ping");

    await waitMessage("pongMsg", (data) => {
      assert.equal(data, "pong");
    });
  });
});


describe('Test user registration', () => {
  const route = "register";
  const username = "Test_user_012354";
  const email = "usertest@gmail.com";
  const password = "12345678"


  it("Should create user with good username and password", async () => {
    return new Promise(async (resolve, reject) => {
        let user = { username, email, password }
        socket.emit(route, JSON.stringify(user));

        await waitMessage(route, async (res) => {
          let expected = JSON.stringify({
            data: {
              username,
              email
            },
            error: {
              code: "",
              message: ""
            },
            status: true
          });
          
          try{
            assert.equal(res, expected);
            socket.removeAllListeners([route]);
            resolve("ok");
          } catch (e) {
            console.log(e);
            reject(e)
          }
        });
    });
  });


  /*
  it("Should not create user with bad email", async () => {
    let user = { username, password, email: "dsafsafd788.com" }
    socket.emit(route, JSON.stringify(user));
    await waitMessage(route, async (res) => {
      let expected = formatErrorMsg("ERR_REGISTER_01", "Invalid Email");
      assert.equal(JSON.parse(res), expected);
    })
  });
  */

  /*
  it("Should not create user with bad password (less than 6 caraters)", async () => {
    let user = { username, email, password: "" }
    socket.emit(route, JSON.stringify(user));
    await waitMessage(route, async (res) => {
      let expected = formatErrorMsg("ERR_REGISTER_02", "Bad password");
      assert.equal(JSON.parse(res), expected);
    });
  });
  */

  it("Should not create existing user", async () => {
    let user = {
      username: "admin",
      email: "admin@server.com",
      password: "01234567889"
    }
    socket.emit(route, JSON.stringify(user));

    await waitMessage(route, async (res) => {
      let expected = formatErrorMsg("ERR_REGISTER_03", "This user is already registered");
      assert.equal(res, JSON.stringify(expected));
    });
  });
});
