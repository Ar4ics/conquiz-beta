var mongoose = require('mongoose');
var User = require('./User');
var Question = require('./Question');
var shuffleArray = require('../helpers/shuffle');
var Schema = mongoose.Schema;

var Game = new Schema({

  stage: {
    type: Number,
    default: 1
  },
  boxes: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    x: Number,
    y: Number,
  }],
  question: {
    start: {
      type: Date
    },
    current: { type: Schema.Types.ObjectId, ref: 'Question' },
    next: { type: Schema.Types.ObjectId, ref: 'Question' },
    history: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
  },
  move: {
    index: {
      type: Number,
      default: 0
    },
    order: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  size: {
    x: {
      type: Number,
      default: 2,
    },
    y: {
      type: Number,
      default: 2,
    }
  },
  box: {
    common: {
      x: Number,
      y: Number
    },
    has: {
      type: Boolean,
      default: false
    },
    competitors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },

  winner: { type: Schema.Types.ObjectId, ref: 'User' }

});

Game.statics.createGame = async function (users, x, y) {
  var question = await Question.getRandomQuestion();
  var orderUsers = users.map(u => u.id);
  shuffleArray(orderUsers);
  return await new this({
    users,
    question: {
      next: question
    },
    size: {
      x, y
    },
    move: {
      order: orderUsers
    }
  }).save();
}

Game.statics.getGame = async function (id) {
  var game = await this.findById(id)
    .populate('users', 'name score color base -_id')
    .populate('boxes.user', 'name color -_id')
    .populate('question.current', 'title answers -_id')
    .populate('winner', 'name -_id')
    .exec();
  var field = [];
  for (let row = 0; row < game.size.y; row++) {
    field.push([]);
    for (let col = 0; col < game.size.x; col++) {
      field[row].push({ user: { color: 'white' } });
    }
  }

  game.boxes.forEach(box => {
    field[box.y][box.x].user = box.user;
  });

  if (game.box.has) {
    field[game.box.common.y][game.box.common.x].common = true;
  }

  game.users.forEach(user => {
    if (user.base.has) {
      var box = game.boxes.find(b => (b._id.equals(user.base.box)));
      field[box.y][box.x].base = true;
    }
  });

  var mover = await User.findById(game.move.order[game.move.index], 'name -_id').exec();

  return {
    _id: game._id,
    boxes: field,
    mover,
    winner: game.winner,
    users: game.users,
    question: game.question.current
  };
};


Game.methods.addBox = async function (user_id, x, y) {
  this.boxes.push({ user: user_id, x, y });
  this.move.index++;
  await this.save();
  return this.boxes[this.boxes.length - 1];
}

Game.methods.setCommonBox = async function (x, y, competitors) {
  this.box = { common: { x, y }, has: true, competitors };
  this.move.index++;
  await this.save();
}

Game.methods.setCurrentQuestion = async function () {
  this.question.current = this.question.next;
  this.question.start = Date.now();
  this.question.history.push(this.question.current);
  this.question.next =
    await Question.getRandomQuestionNotInHistory(this.question.history);
  await this.save();
}

Game.methods.getCurrentQuestion = async function () {
  return await Question.findById(this.question.current).exec();
}

Game.methods.isLegalMove = async function (user_id, x, y) {
  var mover = await this.getMover();

  if (this.winner) {
    return false;
  }

  if (!mover.equals(user_id)) {
    return false;
  }

  if (this.question.current) {
    return false;
  }

  if (x >= this.size.x || y >= this.size.y || x < 0 || y < 0) {
    return false;
  }

  if (this.stage === 3) {
    var target = this.boxes.find(b => (b.x === x && b.y === y));
    if (target.user.equals(user_id)) {
      return false;
    }
    var boxes = [];
    boxes.push(this.boxes.find(b => (b.x === (x - 1) && b.y === y)));
    boxes.push(this.boxes.find(b => (b.x === (x + 1) && b.y === y)));
    boxes.push(this.boxes.find(b => (b.x === x && b.y === (y - 1))));
    boxes.push(this.boxes.find(b => (b.x === x && b.y === (y + 1))));

    if (!boxes.some(b => (b && b.user.equals(user_id)))) {
      return false;
    }

  } else {
    if (this.boxes.find(b => (b.x === x && b.y === y))) {
      return false;
    }
  }

  return true;
}

Game.methods.isLegalAnswer = function (user) {
  if (!this.question.current) {
    return false;
  }

  if (this.winner) {
    return false;
  }

  if (user.question.answered) {
    return false;
  }

  if (this.stage === 3) {
    if (!this.box.competitors.find(c => c.equals(user._id))) {
      return false;
    }
  }

  return true;
}

Game.methods.updateStage = async function () {
  var numBoxes = this.boxes.length;

  if ((this.size.x * this.size.y - numBoxes) === 0) {
    this.stage = 3;
    await this.save();
  } else if ((this.size.x * this.size.y - numBoxes) < this.users.length) {
    this.stage = 2;
    await this.save();
  }
}


Game.methods.getUsersAnswered = async function () {
  var users = await User.find({
    '_id': { $in: this.users }
  }).sort('question.end').exec();
  for (let index = 0; index < users.length; index++) {
    if (!users[index].question.answered) {
      return null;
    }
  }

  return users;
}

Game.methods.getCompetitorsAnswered = async function () {
  var competitors = await User.find({
    '_id': { $in: this.box.competitors }
  }).sort('question.end').exec();

  for (let index = 0; index < competitors.length; index++) {
    if (!competitors[index].question.answered) {
      return null;
    }

  }
  return competitors;
}

Game.methods.getAnswersResults = async function (users) {
  var question = await Question.findById(this.question.current).exec();

  var results = {
    answer: question.correct,
    boxes: [],
    users: []
  }

  users.forEach(async function (user) {

    var time = user.question.end - this.question.start;
    if (user.question.variant === question.correct) {
      user.score.correct++;
      results.users.push({
        user:
          { name: user.name, score: user.score },
        variant: user.question.variant,
        correct: true,
        time
      });
    } else {
      user.score.incorrect++;
      results.users.push({
        user:
          { name: user.name, score: user.score },
        variant: user.question.variant,
        correct: false,
        time
      });

      var index = this.boxes.findIndex(function (item) {
        return item._id.equals(user.box)
      });

      results.boxes.push({ x: this.boxes[index].x, y: this.boxes[index].y });

      this.boxes.splice(index, 1);

      if (user.base.box.equals(user.box)) {
        user.base.has = false;
        user.base.box = null;
      }
    }
    user.question.answered = false;
    user.question.variant = -1;

    await user.save();
  }, this);

  this.question.current = null;
  await this.save();

  return results;

}

Game.methods.getCompetitorsAnswersResults = async function (competitors) {
  var question = await Question.findById(this.question.current).exec();

  var results = {
    answer: question.correct,
    box: {},
    users: []
  }

  console.log('c', competitors);

  var winner = competitors.find(c => c.question.variant === question.correct);

  console.log('w', winner);
  console.log('b', this.box.competitors);
  var base = false;
  if (this.stage === 2) {
    if (winner) {
      this.boxes.push({ user: winner._id, x: this.box.common.x, y: this.box.common.y });
      if (!winner.base.has) {
        winner.base.box = this.boxes[this.boxes.length - 1]._id;
        winner.base.has = true;
        base = true;
      }
    } else {
      winner = { name: '', color: 'white' };
    }
  } else {
    if (winner && winner._id.equals(this.box.competitors[0])) {
      var box = this.boxes.find(b => (b.x === this.box.common.x && b.y === this.box.common.y));
      var lostUser = competitors.find(c => c._id.equals(this.box.competitors[1]));
      if (box._id.equals(lostUser.base.box)) {
        console.log('lost user', box.user);
        lostUser.base.has = false;
      }
      box.user = winner._id;

    } else {
      winner = competitors.find(c => c._id.equals(this.box.competitors[1]));
    }
  }

  results.box = {
    user: { name: winner.name, color: winner.color },
    base,
    x: this.box.common.x, y: this.box.common.y
  };



  competitors.forEach(async function (user) {

    var time = user.question.end - this.question.start;
    if (user.question.variant === question.correct) {
      user.score.correct++;
      results.users.push({
        user:
          { name: user.name, score: user.score },
        variant: user.question.variant,
        correct: true,
        time
      });
    } else {
      user.score.incorrect++;
      results.users.push({
        user:
          { name: user.name, score: user.score },
        variant: user.question.variant,
        correct: false,
        time
      });
    }
    user.question.answered = false;
    user.question.variant = -1;

    await user.save();
  }, this);
  this.box.has = false;
  this.question.current = null;
  await this.save();

  return results;

}
Game.methods.winnerFound = async function (competitors) {
  var winners = competitors.filter(c => c.base.has);
  if (winners.length === 1) {
    this.winner = winners[0]._id;
    await this.save();
    return true;
  }

  return false;

}

Game.methods.getMover = async function () {
  if (this.move.order.length === this.move.index) {
    await this.shuffleUsers();
    return this.move.order[this.move.index];
  }
  return this.move.order[this.move.index];
}

Game.methods.shuffleUsers = async function () {
  var users = this.users.slice();
  shuffleArray(users);
  this.move.index = 0;
  this.move.order = users;
  await this.save();
}

module.exports = mongoose.model('Game', Game);