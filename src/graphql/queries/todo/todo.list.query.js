const {
  GraphQLList
} = require('graphql');

const { TodoService } = require('../../../services');

const { toDoType } = require('../../types');

module.exports = {
  type: new GraphQLList(toDoType),
  args: {},
  resolve(root, params, options) {
    return TodoService.listTodo();
  }
};
