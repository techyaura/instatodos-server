const { TodoService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoLabelValidator, updateTodoLabelValidator } = require('../../validators');

const queries = {
  todoLabelList: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.todoLabelListCount(context);
  }
};

const mutations = {
  addTodoLabel: async (root, args, context) => {
    await ContextMiddleware(context, addTodoLabelValidator(args.input));
    return TodoService.addTodoLabel(context, args.input);
  },
  updateTodoLabel: async (root, args, context) => {
    await ContextMiddleware(context, updateTodoLabelValidator({ ...args.input, id: args.id }));
    return TodoService.updateTodoLabel(context, args, args.input);
  },
  deleteTodoLabel: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.deleteTodoLabel(context, args);
  }
};

module.exports = {
  queries,
  mutations
};