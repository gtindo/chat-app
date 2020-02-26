const axios = require('axios').default;
const config = require('../config');

const AUTH = {
  username: config.EJABBERD_ADMIN,
  password: config.EJABBERD_ADMIN_PASSWORD
}


/**
 * Check if a username is already register
 * return true if user exists
 * 
 * @param {String} username
 * @returns {Boolean} 
 */
exports.checkAccount = async function(username){
  const uri = `${config.EJABBERD_API_URI}/check_account`;
  const data = {
    user: username,
    host: config.XMPP_DOMAIN
  }

  let res = await axios.post(uri, data, {auth: AUTH});
  if (parseInt(res.data) == 0) return true;
  return false;
}


/**
 * @param {String} username
 * @param {String} password
 * @returns {Object} {data: "Success", status: 200}
 */
exports.createAccount = async function(username, password){
  const uri = `${config.EJABBERD_API_URI}/register`;
  const data = {
    user: username,
    host: config.XMPP_DOMAIN,
    password: password
  }
  let res = await axios.post(uri, data, {auth: AUTH})
  return {
    msg: res.data,
    status: res.status
  }
}

/**
 * Change user password
 * return true on success and false on failure
 * 
 * @returns {Boolean} 
 */
exports.changePassword = async function(username, newPassword){
  const uri = `${config.EJABBERD_API_URI}/change_password`;
  const data = {
    user: username,
    host: config.XMPP_DOMAIN,
    newpass: newPassword
  }

  let res = await axios.post(uri, data, {auth: AUTH});
  if (parseInt(res.data) == 0) return true;
  return false;
}


/**
 * Check user password
 * @returns {Boolean}
 */
exports.checkPassword = async function(username, password){
  const uri = `${config.EJABBERD_API_URI}/check_password`;
  const data = {
    user: username,
    password: password,
    host: config.XMPP_DOMAIN
  }

  let res = await axios.post(uri, data, {auth: AUTH});
  if (parseInt(res.data) == 0) return true;
  return false;
}

