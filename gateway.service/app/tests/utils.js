/**
 * function used to wait response on a channel
 * 
 * @param {String} channel 
 * @param {Function} callback 
 */
const waitMessage = async (channel, socket, callback) => {
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

module.exports = {waitMessage, formatErrorMsg};
