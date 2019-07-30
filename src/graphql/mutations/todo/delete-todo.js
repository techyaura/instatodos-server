const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoModel } = require('../../../models');
const toDoSuccessType = require('../../types/todo/success');

module.exports = {
  type: toDoSuccessType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve: (root, args, context, info) => {
    if (typeof (context.user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }

    return TodoModel.remove({
      _id: args._id
    })
      .then(() => ({ ok: true, message: 'Todo deleted successfully' }))
      .catch(err => err);
  }
};
