const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoLabelValidator, updateTodoLabelValidator } = require('../../validators');

module.exports = {
  addTodoLabel: async (root, args, context) => {
    const { next } = context;
    try {
      await ContextMiddleware(context, addTodoLabelValidator(args.input));
      await TodoService.addTodoLabel(context, args.input);
      return { message: 'Todo label has been succesfully added', ok: true };
    } catch (err) {
      return next(err);
    }
  },
  updateTodoLabel: async (root, args, context) => {
    const { next, user } = context;
    try {
      await ContextMiddleware(context, updateTodoLabelValidator({ ...args.input, id: args.id }));
      await TodoService.updateTodo(user, args.id, args.input);
      return { message: 'Todo label has been succesfully updated', ok: true };
    } catch (err) {
      return next(err);
    }
  },
  deleteTodoLabel: async (root, args, context) => {
    const { next, user } = context;
    try {
      await ContextMiddleware(context);
      await TodoService.deleteTodo(user, args);
      return { ok: true, message: 'Todo label deleted successfully' };
    } catch (err) {
      return next(err);
    }
  }
};
