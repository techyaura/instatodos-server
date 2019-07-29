const mongoose = require('mongoose');

// Create the database connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

// CONNECTION EVENTS

// When successfully connected
mongoose.connection.on('connected', () => {
  /* eslint no-console: 0 */
  console.log(`Mongoose default connection open to ${process.env.DB_URL}`);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});
