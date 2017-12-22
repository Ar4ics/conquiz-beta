const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const db = require('./src/db');
const websocket = require('./src/websocket');
const shuffleArray = require('./src/helpers/shuffle');
const app = express();
const port = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
websocket(wss, WebSocket.OPEN);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var Question = require('./src/models/Question');
var Game = require('./src/models/Game');
var User = require('./src/models/User');

app.get('/seed', async function (req, res) {
  await Game.remove({});
  await User.remove({});
  await Question.clearAndFillByCount(1000);
  res.send('cleared');
});


server.listen(process.env.PORT || port, function listening() {
  console.log('listening on %d', server.address().port);
});
