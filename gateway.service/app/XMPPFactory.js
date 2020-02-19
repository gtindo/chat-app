const {client, xml, jid} = require('@xmpp/client');

class XMPPFactory {
  
  static createXmppConnection(username, password, resource){
    return client({
      service: process.env.XMPP_URI,
      domain: process.env.XMPP_DOMAIN,
      resource: resource,
      username: username,
      password: password
    });
  }
}