const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  todoList: (root, args, context) => ContextMiddleware(context).then(() => TodoService.listTodo()),
  todoView: (root, args, context) => ContextMiddleware(context).then(() => TodoService.viewTodo(args))
};
