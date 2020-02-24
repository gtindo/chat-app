const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const socketRouter = require('./app/routes/socket.routes');
socketRouter(io);

const httpRouter = require('./app/routes/http.routes');

const bodyParser = require('body-parser');
const path = require('path')

const config = require('./app/config');

app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static('app/static'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/", httpRouter);

http.listen(config.APP_PORT, () => {
    console.log(`${config.APP_NAME} started on port ${config.APP_PORT}`);
});

