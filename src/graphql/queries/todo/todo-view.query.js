const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoService } = require('../../../services');

const { toDoType } = require('../../types');

module.exports = {
  type: toDoType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve(root, args) {
    return TodoService.viewTodo(args);
  }
};
