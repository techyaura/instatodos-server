const todoQueries = require('./todo.queries');
const userQueries = require('./user.queries');

const resolvers = {
  Query: {
    ...todoQueries,
    ...userQueries
  }
};

module.exports = resolvers;
