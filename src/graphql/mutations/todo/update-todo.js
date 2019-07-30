const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} = require('graphql');

const { TodoModel } = require('../../../models');

const todoAddType = require('../../types/todo/add');

module.exports = {
  type: todoAddType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => TodoModel.updateOne({
    _id: args._id
  }, {
    $set: {
      title: args.title
    }
  })
    .then(() => ({ title: args.title, _id: args._id }))
    .catch(err => err)
};
