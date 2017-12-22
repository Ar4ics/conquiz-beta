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
  await Question.clearAndFillByCount(100);
  res.send('cleared');

  // boot = async () => {
  //   await Game.remove({});
  //   await User.remove({});

  //   await Question.clearAndFillByCount(10);

  //   var users = [{ name: '1', color: 'green' }, { name: '2', color: 'blue' }];
  //   var savedUsers = await User.insertMany(users);

  //   return await Game.createGame(savedUsers);
  // }

  // addBox = async (msg) => {
  //   var game = await Game.findById(msg.game).exec();

  //   if (!game) {
  //     throw new Error('no game');
  //   }

  //   var user = await User.findById(msg.user).exec();

  //   if (!user) {
  //     throw new Error('no user');
  //   }

  //   var legal = game.isLegalMove(user, msg.x, msg.y);

  //   if (!legal) {
  //     throw new Error('illegal move from ' + user.name);
  //   }

  //   var box = await game.addBox(user, msg.x, msg.y);

  //   if (!user.base.has) {
  //     await user.setBase(box);
  //   } else {
  //     user.box = box;
  //     await user.save();
  //   }

  //   return game;
  // }

  // answerQuestion = async (msg) => {
  //   var game = await Game.findById(msg.game).populate('users').exec();

  //   if (!game) {
  //     throw new Error('no game');
  //   }

  //   var user = await User.findById(msg.user).exec();

  //   if (!user) {
  //     throw new Error('no user');
  //   }

  //   var legal = game.isLegalAnswer(user);

  //   if (!legal) {
  //     throw new Error('illegal move from ' + user.name);
  //   }

  //   await user.setAnswer(msg.answer);

  //   var users = await User.find({
  //     '_id': { $in: game.users }
  //   }).exec();

  //   if (game.allUsersAnswered(users)) {
  //     var results = await game.getAnswersResults(users);
  //     await game.shuffleUsers(users);
  //   }

  //   return game;

  // }


  // var game = await boot();
  // var mover = game.getMover();

  // game = await addBox({ x: 0, y: 0, user: mover, game: game._id });
  // mover = game.getMover();
  // if (mover) {
  //   game = await addBox({ x: 2, y: 0, user: mover, game: game._id });
  //   mover = game.getMover();
  //   if (mover) {
  //     console.log('error mover', mover);
  //   } else {
  //     await game.setCurrentQuestion();
  //     var users = game.users;
  //     game = await answerQuestion({ user: users[0], game: game._id, answer: 0 });
  //     if (game.question.current) {
  //       game = await answerQuestion({ user: users[1], game: game._id, answer: 0 });
  //       if (game.question.current) {
  //         console.log('error question', game.question);
  //       }
  //     }
  //   }
  // }

  // res.send(await Game.getGame(game._id));

  // }
  // catch (e) {
  //   console.log("error seeding", e.message);
  //   res.send(e.message);
  // }
});


server.listen(process.env.PORT || port, function listening() {
  console.log('listening on %d', server.address().port);
});
