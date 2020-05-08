const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  todoList: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.listTodo(context, args);
  },
  todoView: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.viewTodo(args);
  },
  todoCompleted: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.completedTodo(context, args);
  }
};
