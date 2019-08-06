const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { TodoService } = require('../../../services');

const { toDoInputType, successType } = require('../../types');

const { updateTodoValidator } = require('../../../validators');


module.exports = {
  type: successType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    input: {
      type: new GraphQLNonNull(toDoInputType)
    }
  },
  resolve: (root, args, context) => {
    const { next, user } = context;
    if (typeof (user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }

    return updateTodoValidator({ ...args.input, _id: args.id }).then(() => TodoService.updateTodo(args.id, args.input))
      .then(() => ({ message: 'Todo has been succesfully updated', ok: true }))
      .catch(err => next(err));
  }
};
