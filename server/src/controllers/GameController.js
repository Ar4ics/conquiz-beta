var Game = require('../models/Game');
var User = require('../models/User');

module.exports.addBox = async (user, game, x, y) => {

  var legal = await game.isLegalMove(user._id, x, y);

  if (!legal) {
    throw new Error('невозможный ход от игрока ' + user.name);
  }

  var box = await game.addBox(user._id, x, y);
  var msg = { x, y };

  if (!user.base.has) {
    msg.base = true;
    msg.shields = user.base.shields;
    await user.setBase(box._id);
  } else {
    msg.base = false;
    msg.shields = 0;
    user.box = box._id;
    await user.save();
  }
  msg.color = user.color;

  return { msg, game };

}

module.exports.setCommonBox = async (user, game, x, y) => {
  var legal = await game.isLegalMove(user._id, x, y);

  if (!legal) {
    throw new Error('невозможный ход от игрока ' + user.name);
  }

  var competitors;
  if (game.stage === 2) {
    competitors = game.users;
  } else {
    var box = game.boxes.find(b => (b.x === x && b.y === y));
    competitors = [user._id, box.user];
  }

  await game.setCommonBox(x, y, competitors);

  var msg = { x, y };

  return { msg, game };

}

module.exports.answerToQuestion = async (user, game, answer) => {

  var legal = game.isLegalAnswer(user);

  if (!legal) {
    throw new Error('невозможный ответ от игрока ' + user.name);
  }

  await user.setAnswer(answer);

  return game;

}


module.exports.getUserGame = async (player, game) => {

  var game = await Game.findById(game).exec();
  if (!game) {
    throw new Error('игра не найдена');
  }
  var user = await User.findById(player).exec();
  if (!user) {
    throw new Error('игрок не найден');
  }

  return { user, game };

}

module.exports.createNewGame = async (clients, players) => {
  var users = await User.insertMany(players);
  var game = await Game.createGame(users, players[0].x, players[0].y);
  for (let index = 0; index < users.length; index++) {
    clients[index].player.db = users[index];
    clients[index].player.game_id = game._id;
  }

  return game;
}

module.exports.getClientsFromGame = (clients, game) => {

  return Object.values(clients).filter(function (c) {
    return game._id.equals(c.player.game_id)
  });

}