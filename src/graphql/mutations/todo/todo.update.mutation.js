const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} = require('graphql');

const { TodoService } = require('../../../services');

const { toDoSuccessType } = require('../../types');

const { updateTodoValidator } = require('../../../validators');


module.exports = {
  type: toDoSuccessType,
  args: {
    _id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => {
    const { res, next, user } = context;
    if (typeof (user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }

    return updateTodoValidator(args).then(() => TodoService.updateTodo(args))
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => next(err));
  }
};
