const uuidv4 = require('uuid/v4');
var Game = require('./models/Game');
var User = require('./models/User');
var { addBox, setCommonBox, answerToQuestion, getUserGame, getClientsFromGame, createNewGame } = require('./controllers/GameController');

const BOX_CLICKED = 'BOX_CLICKED';
const COMMON_BOX_CLICKED = 'COMMON_BOX_CLICKED';
const GET_GAME = 'GET_GAME';
const NEW_GAME = 'NEW_GAME';
const EXISTING_GAME = 'EXISTING_GAME';
const SEARCH_GAME = 'SEARCH_GAME';
const NEW_QUESTION = 'NEW_QUESTION';
const USER_ANSWERED = 'USER_ANSWERED';
const ANSWER_RESULTS = 'ANSWER_RESULTS';
const GAME_OVER = 'GAME_OVER';
const GAME_ERROR = 'GAME_ERROR';

module.exports = (wss, isOpen) => {

  sendGame = (client, game) => {
    if (client.readyState === isOpen) {
      client.send(JSON.stringify({ player: client.player.db, game, type: EXISTING_GAME }));
    }
  }

  broadcastGame = (clients, game) => {
    clients.forEach(function (client) {
      if (client.readyState === isOpen) {
        client.send(JSON.stringify({ player: client.player.db, game, type: NEW_GAME }));
      }
    });
  };

  broadcast = (clients, data) => {
    clients.forEach(function (client) {
      if (client.readyState === isOpen) {
        client.send(JSON.stringify(data));
      }
    });
  };

  var clients = {};

  printClients = () => {
    console.log('now clients',
      Object.keys(clients),
      Object.values(clients).map(function (c) {
        return c.player
      }));
  }


  wss.on('connection', (ws) => {
    console.log('client connected');
    ws.id = uuidv4();
    clients[ws.id] = ws;
    ws.on('message', async (message) => {
      try {
        console.log('message', message);
        var msg = JSON.parse(message);

        switch (msg.type) {

          case GET_GAME:
            var { user, game } = await getUserGame(msg.player, msg.game);
            clients[ws.id].player = {};
            clients[ws.id].player.db = user;
            clients[ws.id].player.game_id = game._id;
            sendGame(clients[ws.id], await Game.getGame(game));
            break;

          case SEARCH_GAME:
            clients[ws.id].player = {
              db: {
                name: msg.user.name,
                color: msg.user.color,
                x: msg.x,
                y: msg.y,
                count: msg.count,
              }
            };
            var targetClients = Object.values(clients).filter(function (c) {
              return c.player && !c.player.game_id
            });
            var first = targetClients[0];
            var found = true;
            for (let index = 1; index < targetClients.length; index++) {
              var element = targetClients[index];

              if ((element.player.db.x !== first.player.db.x) ||
                (element.player.db.y !== first.player.db.y) ||
                (element.player.db.count !== first.player.db.count)) {
                found = false;
                break;
              }

            }
            console.log(targetClients.map(c => c.player.db));
            if (found && (targetClients.length === targetClients[0].player.db.count)) {
              var players = targetClients.map(c => c.player.db);
              var game = await createNewGame(targetClients, players);
              broadcastGame(targetClients, await Game.getGame(game._id));
            }
            break;
          case USER_ANSWERED:
            var { user, game } = await getUserGame(clients[ws.id].player.db._id, clients[ws.id].player.game_id);
            if (game.stage === 1) {
              var game = await answerToQuestion(user, game, msg.answer);
              var users = await game.getUsersAnswered();
              if (users) {
                var results = await game.getAnswersResults(users);
                await game.updateStage();
                broadcast(getClientsFromGame(clients, game),
                  { results, type: ANSWER_RESULTS });
              }
            } else {
              var game = await answerToQuestion(user, game, msg.answer);
              var competitors = await game.getCompetitorsAnswered();
              if (competitors) {
                var results = await game.getCompetitorsAnswersResults(competitors);
                await game.updateStage();
                broadcast(getClientsFromGame(clients, game),
                  { results, type: ANSWER_RESULTS });

                var found = await game.winnerFound(competitors);
                if (found) {
                  var winner = await User.findById(game.winner).exec();
                  broadcast(getClientsFromGame(clients, game),
                    { winner: { name: winner.name }, type: GAME_OVER });
                }
              }
            }

            break;


          case BOX_CLICKED:
            var { user, game } = await getUserGame(clients[ws.id].player.db._id, clients[ws.id].player.game_id);
            if (game.stage === 1) {
              var { msg, game } = await addBox(user, game, msg.x, msg.y);
              var mover = await game.getMover();
              var user = await User.findById(mover);
              broadcast(getClientsFromGame(clients, game),
                { mover: { name: user.name }, box: msg, type: BOX_CLICKED });
              if (game.move.index === 0) {
                await game.setCurrentQuestion();
                var q = await game.getCurrentQuestion();
                broadcast(getClientsFromGame(clients, game),
                  { question: { title: q.title, answers: q.answers }, type: NEW_QUESTION });
              }
            } else {
              var { msg, game } = await setCommonBox(user, game, msg.x, msg.y);
              var mover = await game.getMover();
              var user = await User.findById(mover);
              broadcast(getClientsFromGame(clients, game),
                { mover: { name: user.name }, box: msg, type: COMMON_BOX_CLICKED });
              await game.setCurrentQuestion();
              var q = await game.getCurrentQuestion();
              broadcast(getClientsFromGame(clients, game),
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

    ws.on('close', () => {
      console.log('client disconnected');
      delete clients[ws.id];
    });

  });
}