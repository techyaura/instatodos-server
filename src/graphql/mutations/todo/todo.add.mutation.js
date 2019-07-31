const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { TodoService } = require('../../../services');

const { toDoSuccessType } = require('../../types');

module.exports = {
  type: toDoSuccessType,
  args: {
    title: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => {
    if (typeof (context.user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }
    return TodoService.addTodo(args)
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => err);
  }
};
