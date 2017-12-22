const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/conquiz';
mongoose.connect(mongoDB, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
    console.log('conn opened');
})

db.on('error', function (error) {
    console.error('error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('conn closed');
});

module.exports = db;