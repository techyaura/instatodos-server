const { ProjectService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoProjectValidator, updateTodoProjectValidator } = require('../../validators');

module.exports = {
  addTodoProject: async (root, args, context) => {
    await ContextMiddleware(context, addTodoProjectValidator(args.input));
    return ProjectService.addTodoProject(context, args.input);
  },
  updateTodoProject: async (root, args, context) => {
    await ContextMiddleware(context, updateTodoProjectValidator({ ...args.input, id: args.id }));
    return ProjectService.updateTodoProject(context, args, args.input);
  },
  deleteTodoProject: async (root, args, context) => {
    await ContextMiddleware(context);
    return ProjectService.deleteTodoProject(context, args);
  }
};
