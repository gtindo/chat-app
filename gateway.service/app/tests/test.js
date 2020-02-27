const assert = require('chai').assert;
const socket = require('socket.io-client')("http://localhost:3000");
const testUtils = require('./utils');
const ejabberdApi = require('../apis/ejabberd');
const uuid = require('uuid').v4;


describe('Test Connection', () => {
  it("Should connect, send ping and receive pong", async () => {
    socket.emit("pingMsg", "ping");

    await testUtils.waitMessage("pongMsg", socket, (data) => {
      assert.equal(data, "pong");
    });
  });
});


describe('Test user registration', () => {
  const route = "register";
  const username = "Test_user_"+Math.floor(Math.random() * 10000);
  const email = "usertest@gmail.com";
  const password = "12345678"


  it("Should create user with good username and password", async () => {
    return new Promise(async (resolve, reject) => {
        let user = { username, email, password }
        socket.emit(route, JSON.stringify(user));

        await testUtils.waitMessage(route, socket, async (res) => {
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


  it("Should not create user with bad email", async () => {
    return new Promise(async (resolve, reject) => {
      let user = { username, password, email: "dsafsafd788.com" }
      socket.emit(route, JSON.stringify(user));
      
      await testUtils.waitMessage(route, socket, async (res) => {
        let data = JSON.parse(res);
        let code = "ERR_REGISTER_01";
        let status = false;
        
        try{
          assert.equal(code, data.error.code);
          assert.equal(status, data.status);
          socket.removeAllListeners([route]);
          resolve("ok");
        } catch (e) {
          console.log(e);
          reject("error");
        }
      });
    });
  });


  it("Should not create user with bad password (less than 6 caraters)", async () => {
    return new Promise(async (resolve, reject) => {
      let user = { username, email, password: "e" }
      socket.emit(route, JSON.stringify(user));

      await testUtils.waitMessage(route, socket, async (res) => {
        let code = "ERR_REGISTER_02";
        let status = false;
        let data = JSON.parse(res);

        try {
          assert.equal(code, data.error.code);
          assert.equal(status, data.status);
          socket.removeAllListeners([route]);
          resolve("ok");
        } catch (e) {
          console.log(e);
          reject("error");
        }
      });
    });
  });


  it("Should not create existing user", async () => {
    let user = {
      username: "admin",
      email: "admin@server.com",
      password: "01234567889"
    }
    socket.emit(route, JSON.stringify(user));

    await testUtils.waitMessage(route, socket, async (res) => {
      let expected = testUtils.formatErrorMsg("ERR_REGISTER_03", "This user is already registered");
      assert.equal(res, JSON.stringify(expected));
      socket.removeAllListeners([route]);
    });
  });

  // Delete created user
  after(async () => {
    // !!!! VERY DANGEROUS INSTRUCTION   !!!!
    // !!!! DON'T CHANGE RANDOM USERNAME  !!!!
    await ejabberdApi.deleteAccount(username);
  });
});


describe('Test user login', () => {
  const route = "login";
  const username = "Test_user_"+Math.floor(Math.random() * 10000);
  const password = "12345678"
  
  before(async () => {
    // create test user
    await ejabberdApi.createAccount(username, password);
  });

  
  it("Should log registered user with username and password", () => {
    return new Promise(async (resolve, reject) => {
      let user = {username, password};
      socket.emit("login", JSON.stringify(user));

      await testUtils.waitMessage(route, socket, async (data) => {
        let res = JSON.parse(data);
        try {
          assert.isNotEmpty(res.data.token);
          assert.equal(res.status, true);
          assert.isEmpty(res.error.code);
          socket.removeAllListeners([route]);
          resolve("ok");
        } catch (err) {
          reject(err);
        }
      });
    });
  });


  it("Should not log registered user with bad password", () => {
    return new Promise(async (resolve, reject) => {
      let user = {username, password: "sdfwessdfewe"};
      socket.emit("login", JSON.stringify(user));

      await testUtils.waitMessage(route, socket, async (data) => {
        let res = JSON.parse(data);
        try {
          assert.equal(res.error.code, "ERR_AUTH_01");
          assert.equal(res.status, false);
          socket.removeAllListeners([route]);
          resolve("ok")
        } catch (err) {
          reject(err)
        }
      });
    });
  });


  it("Should not log unregistered user", () => {
    return new Promise(async (resolve, reject) => {
      let user = {username: uuid(), password: "4578541"}
      socket.emit(route, JSON.stringify(user));

      await testUtils.waitMessage(route, socket, async (data) => {
        let res = JSON.parse(data);
        try {
          assert.equal(res.error.code, "ERR_AUTH_01");
          assert.equal(res.status, false);
          socket.removeAllListeners([route]);
          resolve("ok");
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  it("Should send error for invalid data", () => {
    return new Promise(async (resolve, reject) => {
      let user = {bad: "bad", payload: "payload"};
      socket.emit("login", JSON.stringify(user));

      await testUtils.waitMessage(route, socket, async (data) => {
        let res = JSON.parse(data);
        try{
          assert.equal(res.error.code, "ERR_AUTH_03");
          assert.equal(res.status, false);
          socket.removeAllListeners([route]);
          resolve("ok")
        } catch (err) {
          reject(err);
        }
      });
    });
  })

  it("Should not log admin user", () => {
    return new Promise(async (resolve, reject) => {
      let user = {username: "admin", password: "0124571"};
      socket.emit(route, JSON.stringify(user));

      await testUtils.waitMessage(route, socket, async (data) => {
        let res = JSON.parse(data);
        try {
          assert.equal(res.error.code, "ERR_AUTH_02");
          assert.equal(res.status, false);
          socket.removeAllListeners([route]);
          resolve("ok");
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  after(async () => {
    await ejabberdApi.deleteAccount(username);
  });
});
