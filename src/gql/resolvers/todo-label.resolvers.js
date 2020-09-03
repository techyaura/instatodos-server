const { TodoLabelService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoLabelValidator, updateTodoLabelValidator } = require('../../validators');

const queries = {
  todoLabelList: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return await TodoLabelService.todoLabelListCount(context);
    } catch (err) {
      throw err;
    }
  }
};

const mutations = {
  addTodoLabel: async (_, args, context) => {
    try {
      await ContextMiddleware(context, addTodoLabelValidator(args.input));
      return TodoLabelService.addTodoLabel(context, args.input);
    } catch (err) {
      throw err;
    }
  },
  updateTodoLabel: async (_, args, context) => {
    try {
      await ContextMiddleware(context, updateTodoLabelValidator({ ...args.input, id: args.id }));
      return TodoLabelService.updateTodoLabel(context, args, args.input);
    } catch (err) {
      throw err;
    }
  },
  deleteTodoLabel: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return TodoLabelService.deleteTodoLabel(context, args);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = {
  queries,
  mutations
};
