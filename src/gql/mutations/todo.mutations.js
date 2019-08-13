const { TodoService } = require('../../services');
const { addTodoValidator, updateTodoValidator } = require('../../validators');

module.exports = {
  addTodo: (root, args, context) => {
    const { next, user } = context;
    if (typeof (user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }
    return addTodoValidator(args.input).then(() => TodoService.addTodo({ ...args.input, user: user._id }))
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => next(err));
  },
  updateTodo: (root, args, context) => {
    const { next, user } = context;
    if (typeof (user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }
    return updateTodoValidator({ ...args.input, _id: args.id }).then(() => TodoService.updateTodo(user, args.id, args.input))
      .then(() => ({ message: 'Todo has been succesfully updated', ok: true }))
      .catch(err => next(err));
  },
  deleteTodo: (root, args, context) => {
    const { next, user } = context;
    if (typeof (user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }
    return TodoService.deleteTodo(user, args)
      .then(() => ({ ok: true, message: 'Todo deleted successfully' }))
      .catch(err => next(err));
  }
};
