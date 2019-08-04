const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoService } = require('../../../services');

const { successType } = require('../../types');

module.exports = {
  type: successType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) }
  },
  resolve: (root, args, context, info) => {
    const { res, next, user } = context;
    if (typeof (user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }

    return TodoService.deleteTodo(args)
      .then(() => ({ ok: true, message: 'Todo deleted successfully' }))
      .catch(err => next(err));
  }
};
