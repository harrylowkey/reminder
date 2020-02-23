const mongoose = require('mongoose');
MONGO_URL = process.env.MONGO_DB_URL
let connect = () => {
  mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connect to MongoDB successfully!!!')
  });
}

module.exports = { connect }