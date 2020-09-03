const { TodoCommentService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoCommentValidator, updateTodoCommentValidator } = require('../../validators');

const mutations = {
  addTodoComment: async (_, args, context) => {
    try {
      await ContextMiddleware(context, addTodoCommentValidator({ ...args.input, todoId: args.todoId }));
      return TodoCommentService.addTodoComment(context, args, args.input);
    } catch (err) {
      throw err;
    }
  },
  updateTodoComment: async (_, args, context) => {
    try {
      await ContextMiddleware(context, updateTodoCommentValidator({ ...args.input, todoId: args.todoId, id: args.id }));
      return TodoCommentService.updateTodoComment(context, args, args.input);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = {
  mutations
};
