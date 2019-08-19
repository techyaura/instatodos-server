const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoValidator, updateTodoValidator } = require('../../validators');

module.exports = {
  addTodo: (root, args, context) => {
    const { user, next } = context;
    return ContextMiddleware(context, addTodoValidator(args.input))
      .then(() => TodoService.addTodo({ ...args.input, user: user._id }))
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => next(err));
  },
  updateTodo: (root, args, context) => {
    const { next, user } = context;
    return ContextMiddleware(context, updateTodoValidator({ ...args.input, id: args.id }))
      .then(() => TodoService.updateTodo(user, args.id, args.input))
      .then(() => ({ message: 'Todo has been succesfully updated', ok: true }))
      .catch(err => next(err));
  },
  deleteTodo: (root, args, context) => {
    const { next, user } = context;
    return ContextMiddleware(context)
      .then(() => TodoService.deleteTodo(user, args))
      .then(() => ({ ok: true, message: 'Todo deleted successfully' }))
      .catch(err => next(err));
  }
};
