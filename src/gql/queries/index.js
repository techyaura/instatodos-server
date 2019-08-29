const todoQueries = require('./todo.queries');
const todoLabelQueries = require('./todo-label.queries');
const userQueries = require('./user.queries');

const resolvers = {
  Query: {
    ...todoQueries,
    ...todoLabelQueries,
    ...userQueries
  }
};

module.exports = resolvers;
