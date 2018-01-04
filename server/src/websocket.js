const uuidv4 = require('uuid/v4');
var Game = require('./models/Game');
var User = require('./models/User');
var { addBox, setCommonBox, answerToQuestion, getUserGame, getClientsFromGame, createNewGame } = require('./controllers/GameController');
var { generateColor } = require('./helpers/generators');

const BOX_CLICKED = 'BOX_CLICKED';
const COMMON_BOX_CLICKED = 'COMMON_BOX_CLICKED';
const GET_GAME = 'GET_GAME';
const GAME = 'GAME';
const CREATE_GAME = 'CREATE_GAME';
const CURRENT_GAMES = 'CURRENT_GAMES';
const JOIN_GAME = 'JOIN_GAME';
const LEAVE_GAME = 'LEAVE_GAME';
const GAME_FOUND = 'GAME_FOUND';
const GAME_OVER = 'GAME_OVER';
const GAME_ERROR = 'GAME_ERROR';
const NEW_QUESTION = 'NEW_QUESTION';
const USER_ANSWERED = 'USER_ANSWERED';
const ANSWER_RESULTS = 'ANSWER_RESULTS';
const GAME_CREATED = 'GAME_CREATED';
const GAME_NOT_FOUND = 'GAME_NOT_FOUND';
const CONNECTED_CLIENTS = 'CONNECTED_CLIENTS';

module.exports = (wss, isOpen) => {

  broadcast = (clients, data) => {
    clients.forEach(function (client) {
      if (client.readyState === isOpen) {
        client.send(JSON.stringify(data));
      }
    });
  };

  var games = {};

  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping('', false, true);
      console.log('ping');
    });
  }, 10000);

  wss.on('connection', (ws) => {
    console.log('client connected');
    ws.uid = uuidv4();
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
      console.log('pong');
    });

    ws.on('message', async (message) => {
      try {
        console.log('message', message);
        var msg = JSON.parse(message);
        switch (msg.type) {
          case GET_GAME:
            if (ws.game_id) {
              var dbGame = await Game.getGame(ws.game_id);
              ws.send(JSON.stringify({ game: dbGame, type: GAME }));
            } else {
              var game = games[msg.game_uid];
              var player = await User.findById(msg.player_id).exec();
              if (!game || !game.id || !player) {
                ws.send(JSON.stringify({ type: GAME_NOT_FOUND }));
                return;
              }
              ws.name = player.name;
              var found = game.users.find(u => u.name === ws.name);
              if (found) {
                throw new Error('обнаружен мультилогин от игрока ' + ws.name);
              }
              var user = {
                uid: ws.uid,
                name: ws.name,
                color: player.color
              };
              ws.game_uid = msg.game_uid;
              ws.game_id = game.id;
              ws.id = msg.player_id;
              game.users.push(user);

              var dbGame = await Game.getGame(ws.game_id);
              ws.send(JSON.stringify({ game: dbGame, type: GAME }));

              console.log(games);
              broadcast(wss.clients, { games, type: CURRENT_GAMES });
            }

            break;

          case CURRENT_GAMES:
            console.log(games);
            ws.send(JSON.stringify({ games, type: CURRENT_GAMES }));
            break;

          case CONNECTED_CLIENTS:
            broadcast(wss.clients, { count: wss.clients.size, type: CONNECTED_CLIENTS });

            break;

          case CREATE_GAME:
            if (!ws.game_uid) {
              var game_uid = uuidv4();
              ws.name = msg.name;
              var user = {
                uid: ws.uid,
                name: ws.name,
                color: generateColor()
              };
              ws.game_uid = game_uid;
              var game = games[game_uid] = {};
              game.users = [user];
              game.x = msg.x;
              game.y = msg.y;
              game.count = msg.count;

              ws.send(JSON.stringify({ game_uid, type: GAME_CREATED }));
              console.log(games);
              broadcast(wss.clients, { games, type: CURRENT_GAMES });
            }
            break;

          case JOIN_GAME:
            if (!ws.game_uid) {
              var game_uid = msg.uid;
              var game = games[game_uid];
              var found = game.users.find(u => u.name === msg.name);
              if (!found) {
                ws.name = msg.name;
                var user = {
                  uid: ws.uid,
                  name: ws.name,
                  color: generateColor()
                };
                ws.game_uid = game_uid;
                game.users.push(user);
                if (game.users.length === game.count) {
                  var dbGame = await createNewGame(game);
                  game.id = dbGame._id;
                  var clients = getClientsFromGame(wss.clients, game_uid);
                  for (let index = 0; index < clients.length; index++) {
                    var client = clients[index];
                    if (client.readyState === isOpen) {
                      client.id = dbGame.users.find(u => u.name === client.name)._id;
                      client.game_id = dbGame._id;
                      client.send(JSON.stringify({ player_id: client.id, type: GAME_FOUND }));
                    }
                  }
                }
                console.log(games);
                broadcast(wss.clients, { games, type: CURRENT_GAMES });
              }
            }
            break;

          case LEAVE_GAME:
            if (ws.game_uid) {
              var game = games[ws.game_uid];
              var index = game.users.findIndex(u => u.uid === ws.uid);
              game.users.splice(index, 1);
              if (game.users.length === 0) {
                delete games[ws.game_uid];
              }
              ws.game_uid = null;
              ws.game_id = null;
              ws.id = null;
              console.log(games);
              broadcast(wss.clients, { games, type: CURRENT_GAMES });
            }
            break;

          case USER_ANSWERED:
            var { user, game } = await getUserGame(ws.id, ws.game_id);
            if (game.stage === 1) {
              var game = await answerToQuestion(user, game, msg.answer);
              var users = await game.getUsersAnswered();
              if (users) {
                var results = await game.getAnswersResults(users);
                await game.updateStage();
                broadcast(getClientsFromGame(wss.clients, ws.game_uid),
                  { results, type: ANSWER_RESULTS });
              }
            } else {
              var game = await answerToQuestion(user, game, msg.answer);
              var competitors = await game.getCompetitorsAnswered();
              if (competitors) {
                var results = await game.getCompetitorsAnswersResults(competitors);
                await game.updateStage();
                broadcast(getClientsFromGame(wss.clients, ws.game_uid),
                  { results, type: ANSWER_RESULTS });

                var found = await game.winnerFound(competitors);
                if (found) {
                  var winner = await User.findById(game.winner).exec();
                  broadcast(getClientsFromGame(wss.clients, ws.game_uid),
                    { winner: { name: winner.name }, type: GAME_OVER });
                }
              }
            }
            break;


          case BOX_CLICKED:
            var { user, game } = await getUserGame(ws.id, ws.game_id);
            if (game.stage === 1) {
              var { msg, game } = await addBox(user, game, msg.x, msg.y);
              var mover = await game.getMover();
              var user = await User.findById(mover);
              broadcast(getClientsFromGame(wss.clients, ws.game_uid),
                { mover: { name: user.name }, box: msg, type: BOX_CLICKED });
              if (game.move.index === 0) {
                await game.setCurrentQuestion();
                var q = await game.getCurrentQuestion();
                broadcast(getClientsFromGame(wss.clients, ws.game_uid),
                  { question: { title: q.title, answers: q.answers }, type: NEW_QUESTION });
              }
            } else {
              var { msg, game } = await setCommonBox(user, game, msg.x, msg.y);
              var mover = await game.getMover();
              var user = await User.findById(mover);
              broadcast(getClientsFromGame(wss.clients, ws.game_uid),
                { mover: { name: user.name }, box: msg, type: COMMON_BOX_CLICKED });
              await game.setCurrentQuestion();
              var q = await game.getCurrentQuestion();
              broadcast(getClientsFromGame(wss.clients, ws.game_uid),
                { question: { title: q.title, answers: q.answers }, type: NEW_QUESTION });
            }
            break;

          default:
            console.log("received unknown message type: '" + msg.type + "'");
            break;
        }

      }
      catch (e) {
        console.log('error', e);
        broadcast(wss.clients, { error: e.message, type: GAME_ERROR });
      }
    });

    ws.on('error', (e) => console.log('error socket', e));

    ws.on('close', () => {
      console.log('client disconnected');
      if (ws.game_uid) {
        var game = games[ws.game_uid];
        var index = game.users.findIndex(u => u.uid === ws.uid);
        game.users.splice(index, 1);
        if (game.users.length === 0 && !ws.game_id) {
          delete games[ws.game_uid];
        }
        console.log(games);
        broadcast(wss.clients, { games, type: CURRENT_GAMES });
      }
      broadcast(wss.clients, { count: wss.clients.size, type: CONNECTED_CLIENTS });
    });
  });
}