const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoModel } = require('../../../models');

const todoListType = require('../../types/todo/list');

module.exports = {
  type: todoListType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve(root, params, options) {
    return TodoModel.findById(params._id).exec();
  }
};
