const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoService } = require('../../../services');

const todoListType = require('../../types/todo/list');

module.exports = {
  type: todoListType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve(root, args, options) {
    return TodoService.viewTodo(args);
  }
};
