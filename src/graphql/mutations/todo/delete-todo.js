const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoModel } = require('../../../models');
const todoDeleteType = require('../../types/todo/delete');


module.exports = {
  type: todoDeleteType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve: (root, args, context, info) => TodoModel.remove({
    _id: args._id
  })
    .then(() => ({ ok: true }))
    .catch(err => err)
};
