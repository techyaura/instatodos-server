const dbConnection = require('./src/config/db');
const Server = require('./src/config/server');

module.exports = new Server(dbConnection);
