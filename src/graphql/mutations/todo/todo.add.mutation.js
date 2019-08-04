const { TodoService } = require('../../../services');

const { successType, toDoInputType } = require('../../types');

const { addTodoValidator } = require('../../../validators');

module.exports = {
  type: successType,
  args: {
    input: {
      type: toDoInputType
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

    return addTodoValidator(args.input).then(() => TodoService.addTodo(args.input))
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => next(err));
  }
};
