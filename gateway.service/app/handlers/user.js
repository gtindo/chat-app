const ejabberdApi = require('../apis/ejabberd');
const validator = require('../validators/validator');
const schemas = require('../validators/schemas')


const registerRes = (username, email, code, message, status) => {
  return {
    data: status ? {username, email} : {},
    error: {code, message},
    status: status
  }
}


/**
 * 
 */
exports.register = async (data) => {
  return new Promise(async (resolve, reject) => {
    try{
      let {username, password, email} = JSON.parse(data);
      let validation = validator.validate({username, password, email}, schemas.register);

      if(validation.valid){
        // Check if user exists
        let account_status = await ejabberdApi.checkAccount(username);2
        if(account_status){
          resolve(JSON.stringify(registerRes(username, email, "ERR_REGISTER_03", "This user is already registered", false)));
          return 
        }

        let {status} = await ejabberdApi.createAccount(username, password);
        
        if(status === 200){
          let response = registerRes(username, email, "", "", true);
          resolve(JSON.stringify(response))
        } else {
          reject("An error occured on xmpp server");
        }
      }
    } catch (err) {
      console.log(err)
      reject("error");
    }
  });
}
