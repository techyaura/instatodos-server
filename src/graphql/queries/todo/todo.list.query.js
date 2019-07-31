const {
  GraphQLList
} = require('graphql');

const { TodoService } = require('../../../services');

const todoListType = require('../../types/todo/list');

module.exports = {
  type: new GraphQLList(todoListType),
  args: {},
  resolve(root, params, options) {
    return TodoService.listTodo();
  }
};
