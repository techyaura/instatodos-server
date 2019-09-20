const todoQueries = require('./todo.queries');
const todoLabelQueries = require('./todo-label.queries');
const userQueries = require('./user.queries');
const thoughtQueries = require('./thought.queries');

const resolvers = {
  Query: {
    ...todoQueries,
    ...todoLabelQueries,
    ...userQueries,
    ...thoughtQueries
  }
};

module.exports = resolvers;
