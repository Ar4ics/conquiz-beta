var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shuffleArray = require('../helpers/shuffle');
var Question = new Schema({
  title: {
    type: String
  },
  answers: [{
    type: String
  }],
  correct: {
    type: Number
  }
});

Question.statics.getRandomQuestion = async function () {
  return (await this.aggregate(
    [{ $sample: { size: 1 } }]
  ).exec())[0];
}


Question.statics.clearAndFillByCount = async function (n) {
  await this.remove({});
  var qs = require('../questions.json').slice(0, n);
  var questions = [];
  for (q of qs) {
    var correct_answer = q.answers[0];
    shuffleArray(q.answers);
    q.correct = q.answers.indexOf(correct_answer);
    questions.push(q);
  }

  await this.insertMany(questions);
}

Question.statics.getRandomQuestionNotInHistory = async function (history) {
  return (await this.aggregate(
    [{
      $match: {
        "_id": { "$nin": history }
      }
    },
    { $sample: { size: 1 } }]
  ).exec())[0];
}


module.exports = mongoose.model('Question', Question);