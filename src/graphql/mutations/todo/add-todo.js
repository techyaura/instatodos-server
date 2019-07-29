const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const TodoModel = require('../../../models/todo');

const todoAddType = require('../../types/todo/add');

module.exports = {
  type: todoAddType,
  args: {
    title: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => {
    const todo = new TodoModel(args);
    return todo.save();
  }
};
