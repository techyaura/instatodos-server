const {
  GraphQLList
} = require('graphql');

const TodoModel = require('../../../models/todo');

const todoListType = require('../../types/todo/list');

module.exports = {
  type: new GraphQLList(todoListType),
  args: {},
  resolve(root, params, options) {
    return TodoModel
      .find()
      .exec();
  }
};
