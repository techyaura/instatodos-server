const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const {
  addTodoValidator, updateTodoValidator, addTodoCommentValidator, updateTodoCommentValidator
} = require('../../validators');

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
  },
  addTodoComment: async (root, args, context) => {
    const { next } = context;
    try {
      await ContextMiddleware(context, addTodoCommentValidator({ ...args.input, todoId: args.todoId }));
      await TodoService.addTodoComment(context, { todoId: args.todoId }, args.input);
      return { message: 'Todo has been succesfully commented', ok: true };
    } catch (err) {
      return next(err);
    }
  },
  updateTodoComment: async (root, args, context) => {
    const { next } = context;
    try {
      await ContextMiddleware(context, updateTodoCommentValidator({ ...args.input, todoId: args.todoId, id: args.id }));
      await TodoService.updateTodoComment(context, { todoId: args.todoId, commentId: args.id }, args.input);
      return { message: 'Todo has been succesfully commented', ok: true };
    } catch (err) {
      return next(err);
    }
  }
};
