const {
  GraphQLNonNull
} = require('graphql');

const { TodoService } = require('../../../services');

const { toDoInputType, successType } = require('../../types');

const { updateTodoValidator } = require('../../../validators');


module.exports = {
  type: successType,
  args: {
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

    return updateTodoValidator(args).then(() => TodoService.updateTodo(args))
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => next(err));
  }
};
