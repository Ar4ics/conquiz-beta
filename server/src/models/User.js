var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: String,
  score: {
    correct: {
      type: Number,
      default: 0
    },
    incorrect: {
      type: Number,
      default: 0
    }
  },
  color: String,
  box: { type: Schema.Types.ObjectId },
  base: {
    box: { type: Schema.Types.ObjectId },
    has: {
      type: Boolean,
      default: false
    }
  },
  question: {
    variant: Number,
    answered: {
      type: Boolean,
      default: false
    },
    end: {
      type: Date
    }
  }
});


User.methods.setBase = async function (box_id) {
  this.base = { box: box_id, has: true };
  this.box = box_id;
  await this.save();
}

User.methods.setAnswer = async function (answer) {
  this.question = { variant: answer, answered: true, end: Date.now() };
  await this.save();
}


module.exports = mongoose.model('User', User);