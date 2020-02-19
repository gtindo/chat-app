const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');
const path = require('path');

const config = require('./app/config');

app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static('app/static'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', (req, res) => {
  return res.json({
    "app_name": config.APP_NAME, 
    "app_version": config.APP_VERSION
  });
});

app.listen(config.APP_PORT, () => {
    console.log(`${config.APP_NAME} started on port ${config.APP_PORT}`);
});

