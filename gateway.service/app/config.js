require('dotenv').config();

const config = {
  APP_PORT: process.env.APP_PORT || 3000,
  APP_NAME: process.env.APP_NAME || "",
  APP_VERSION: process.env.APP_VERSION || "",
  XMPP_DOMAIN: process.env.XMPP_DOMAIN || "ejabberd",
  XMPP_PROTOCOL: process.env.XMPP_PROTOCOL || "xmpp",
  XMPP_PORT: process.env.XMPP_PORT || 5222
}

module.exports = config;
