const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} = require('graphql');

const { TodoService } = require('../../../services');

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

    return TodoService.updateTodo(args)
      .then(() => ({ message: 'Todo has been succesfully updated', ok: true }))
      .catch(err => err);
  }
};
