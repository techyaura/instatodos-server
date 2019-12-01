const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  todoList: (root, args, context) => ContextMiddleware(context).then(() => TodoService.listTodo({ context, args })),
  todoView: (root, args, context) => ContextMiddleware(context).then(() => TodoService.viewTodo(args)),
  todoCompleted: (root, args, context) => ContextMiddleware(context).then(() => TodoService.completedTodo({ context, args })),
};
