const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} = require('graphql');

const { TodoModel } = require('../../../models');

const toDoSuccessType = require('../../types/todo/success');

module.exports = {
  type: toDoSuccessType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => {
    if (typeof (context.user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }

    return TodoModel.updateOne({
      _id: args._id
    }, {
      $set: {
        title: args.title
      }
    })
      .then(() => ({ title: args.title, _id: args._id }))
      .catch(err => err);
  }
};
