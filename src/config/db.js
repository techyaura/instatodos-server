const { success, error } = require('../utils/console-log');

module.exports = () => {
  const mongoose = require('mongoose');
  // Create the database connection
  mongoose.Promise = global.Promise;

  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    // CONNECTION EVENTS

    // When successfully connected
    mongoose.connection.on('connected', () => {
    /* eslint no-console: 0 */
      console.log(success('=> DB Connected'));
      return resolve();
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      console.log(error(`Mongoose default connection error: ${err}`));
      return reject(err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log(error('Mongoose default connection disconnected'));
      return reject(new Error('Mongoose default connection disconnected'));
    });
  });
};
