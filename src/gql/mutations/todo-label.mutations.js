const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoLabelValidator, updateTodoLabelValidator } = require('../../validators');

module.exports = {
  addTodoLabel: async (root, args, context) => {
    await ContextMiddleware(context, addTodoLabelValidator(args.input));
    return TodoService.addTodoLabel(context, args.input);
  },
  updateTodoLabel: async (root, args, context) => {
    const { user } = context;
    await ContextMiddleware(context, updateTodoLabelValidator({ ...args.input, id: args.id }));
    await TodoService.updateTodo(user, args.id, args.input);
  },
  deleteTodoLabel: async (root, args, context) => {
    const { user } = context;
    await ContextMiddleware(context);
    return TodoService.deleteTodo(user, args);
  }
};
