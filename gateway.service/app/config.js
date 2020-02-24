require('dotenv').config();

const config = {
  APP_PORT: process.env.APP_PORT || 3000,
  APP_NAME: process.env.APP_NAME || "",
  APP_VERSION: process.env.APP_VERSION || "",
  XMPP_DOMAIN: process.env.XMPP_DOMAIN || "ejabberd",
  XMPP_PROTOCOL: process.env.XMPP_PROTOCOL || "xmpp",
  XMPP_PORT: process.env.XMPP_PORT || 5222,
  EJABBERD_API_URI: process.env.EJABBERD_API_URI || "https://ejabberd:5280/",
  EJABBERD_CLIENT_ID: process.env.EJABBERD_CLIENT_ID || "",
  EJABBERD_CLIENT_NAME: process.env.EJABBERD_CLIENT_NAME || "",
  EJABBERD_SECRET: process.env.EJABBERD_SECRET || "",
  EJABBERD_ADMIN: process.env.EJABBERD_ADMIN || "",
  EJABBERD_ADMIN_PASSWORD: process.env.EJABBERD_ADMIN_PASSWORD || ""
}

module.exports = config;
