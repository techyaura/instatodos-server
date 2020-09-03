const { ProjectService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoProjectValidator, updateTodoProjectValidator } = require('../../validators');

const queries = {
  todoProjectList: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return ProjectService.todoProjectListCount(context);
    } catch (err) {
      throw err;
    }
  }
};

const mutations = {
  addTodoProject: async (_, args, context) => {
    try {
      await ContextMiddleware(context, addTodoProjectValidator(args.input));
      return ProjectService.addTodoProject(context, args.input);
    } catch (err) {
      throw err;
    }
  },
  updateTodoProject: async (_, args, context) => {
    try {
      await ContextMiddleware(context, updateTodoProjectValidator({ ...args.input, id: args.id }));
      return ProjectService.updateTodoProject(context, args, args.input);
    } catch (err) {
      throw err;
    }
  },
  deleteTodoProject: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return ProjectService.deleteTodoProject(context, args);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = {
  queries,
  mutations
};
