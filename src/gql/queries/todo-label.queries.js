const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  todoLabelList: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.todoLabelListCount(context);
  }
};
