const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoValidator, updateTodoValidator } = require('../../validators');

module.exports = {
  addTodo: async (root, args, context) => {
    const { user, next } = context;
    try {
      await ContextMiddleware(context, addTodoValidator(args.input));
      await TodoService.addTodo({ ...args.input, user: user._id });
      return { message: 'Todo has been succesfully added', ok: true };
    } catch (err) {
      return next(err);
    }
  },
  updateTodo: async (root, args, context) => {
    const { next, user } = context;
    try {
      await ContextMiddleware(context, updateTodoValidator({ ...args.input, id: args.id }));
      await TodoService.updateTodo(user, args.id, args.input);
      return { message: 'Todo has been succesfully updated', ok: true };
    } catch (err) {
      return next(err);
    }
  },
  deleteTodo: async (root, args, context) => {
    const { next, user } = context;
    try {
      await ContextMiddleware(context);
      await TodoService.deleteTodo(user, args);
      return { ok: true, message: 'Todo deleted successfully' };
    } catch (err) {
      return next(err);
    }
  }
};
