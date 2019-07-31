const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoService } = require('../../../services');

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

    return TodoService.deleteTodo(args)
      .then(() => ({ ok: true, message: 'Todo deleted successfully' }))
      .catch(err => err);
  }
};
