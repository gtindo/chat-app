const {client, xml, jid} = require('@xmpp/client');
const debug = require('@xmpp/debug');

const xmpp = client({
  service: 'xmpp://ejabberd:5222',
  domain: "ejabberd",
  resource: "server",
  username: "admin",
  password: "admin"
});

// debug(xmpp, true);

xmpp.on('error', err => {
  console.log(err);
});

xmpp.on('offline', () => {
  console.log('offline');
});

xmpp.on('stanza', async stanza => {
  if (stanza.is('message')) {
    await xmpp.send(xml('presence', {type: 'available'}))
    //await xmpp.stop()
  }
});

xmpp.on('online', async address => {
  await xmpp.send(xml('presence'));

  const message = xml(
    'message',
    {type: 'chat', to: address},
    xml('body', {}, 'hello world')
  );

  await xmpp.send(message);
});

xmpp.start().catch(console.error);
