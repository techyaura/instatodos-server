const { TodoService } = require('../../services');
const { ContextMiddleware, TodoMiddlewares } = require('../../middlewares');
const {
  addTodoValidator, updateTodoValidator, addTodoCommentValidator, updateTodoCommentValidator
} = require('../../validators');

module.exports = {
  addTodo: async (root, args, context) => {
    const { user } = context;
    await ContextMiddleware(context, addTodoValidator(args.input));
    return TodoService.addTodo({ ...args.input, user: user._id });
  },
  updateTodo: async (root, args, context) => {
    const { user } = context;
    await ContextMiddleware(context, updateTodoValidator({ ...args.input, id: args.id }), TodoMiddlewares.checkLabel(context, args.input));
    return TodoService.updateTodo(user, args.id, args.input);
  },
  deleteTodo: async (root, args, context) => {
    const { user } = context;
    await ContextMiddleware(context);
    return TodoService.deleteTodo(user, args);
  },
  addTodoComment: async (root, args, context) => {
    await ContextMiddleware(context, addTodoCommentValidator({ ...args.input, todoId: args.todoId }));
    return TodoService.addTodoComment(context, { todoId: args.todoId }, args.input);
  },
  updateTodoComment: async (root, args, context) => {
    await ContextMiddleware(context, updateTodoCommentValidator({ ...args.input, todoId: args.todoId, id: args.id }));
    return TodoService.updateTodoComment(context, { todoId: args.todoId, commentId: args.id }, args.input);
  }
};
