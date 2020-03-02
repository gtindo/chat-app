const ejabberdApi = require('../apis/ejabberd');
const validator = require('../validators/validator');
const schemas = require('../validators/schemas');

const INTERNAL_SERVER_ERROR = {
  data: {}, 
  error: {code: "ERR_INTERNAL", message: "Internal server error"}, 
  status: false
}


/**
 * Format register response
 * 
 * @param {String} username 
 * @param {String} email 
 * @param {String} code 
 * @param {String} message 
 * @param {Boolean} status
 * @returns {Object} 
 */
const registerRes = (username, email, code, message, status) => {
  return {
    data: status ? {username, email} : {},
    error: {code, message},
    status: status
  }
}


/**
 * This function register a user on ejabberd service
 * 
 * It takes user credentials as parameter, then validate them, if there
 * is an issue it return an error code, else it return an object like :
 * 
 * {
 *  data : {username: "", email: ""},
 *  error: {code: "", message: ""},
 *  status: true
 * }
 * 
 * @param {Object} data {username: "", email: "", password: ""}
 * @returns {Promise<String>} Stringify json with response
 */
exports.register = async (data) => {
  return new Promise(async (resolve, reject) => {
    try{
      let {username, password, email} = JSON.parse(data);
      let validation = validator.validate({username, password, email}, schemas.register);
      
      if(!validation.valid){
        let error = validation.errors[0].message.split(":");
        let code = error[0];
        let msg = error[1];
        resolve(registerRes(username, email, code, msg, false));
        return;
      }
      
      if(validation.valid){
        // Check if user exists
        let account_status = await ejabberdApi.checkAccount(username);2
        if(account_status){
          resolve(registerRes(username, email, "ERR_REGISTER_03", "This user is already registered", false));
          return 
        }

        let {status} = await ejabberdApi.createAccount(username, password);
        
        if(status === 200){
          let response = registerRes(username, email, "", "", true);
          resolve(response)
        } else {
          reject("An error occured on xmpp server");
        }
      }
    } catch (err) {
      console.log(err)
      reject(INTERNAL_SERVER_ERROR); // Internal server error message
    }
  });
}


/**
 * Authenticate a user given his username and password
 * return JWT token that expires after 
 * 
 * @param {String} data user credentials as stringify json {username: "", password: ""}
 * @returns {Object} {data: {username: ""}, error: {code: "", message: ""}, status: }
 */
exports.login = async (data) => {
  return new Promise(async (resolve, reject) => {
    try{
      let {username, password} = JSON.parse(data);
      let validation = validator.validate({username, password}, schemas.login);

      if(!validation.valid){
        resolve({data: {}, error: {code: "ERR_AUTH_03", message: "Validation error"}, status: false});
        return
      }

      if(username === "admin") {
        resolve({data: {}, error: {code: "ERR_AUTH_02", message: "Invalid user"}, status: false});
        return
      }

      if(validation.valid){
        let account_status = await ejabberdApi.checkAccount(username);
        if(account_status){
          let check_password = await ejabberdApi.checkPassword(username, password);

          if(check_password){
            let token = "A JWT TOKEN"; // replace with a real token
            resolve({data: {username, token, password}, error: {code: "", message: ""}, status: true});
            return;
          }else{
            resolve({data: {}, error: {code: "ERR_AUTH_01", message: "Bad username or password"}, status: false});
            return
          }
        }else {
          resolve({data: {}, error: {code: "ERR_AUTH_01", message: "Bad username or password"}, status: false});
          return
        }
      }
    } catch (err) {
      console.log(err);
      reject(INTERNAL_SERVER_ERROR); 
    }
  });
}
