const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  todoLabelList: (root, args, context) => ContextMiddleware(context).then(() => TodoService.todoLabelList(context))
};
