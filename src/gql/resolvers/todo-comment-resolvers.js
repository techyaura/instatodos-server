const { TodoCommentService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addTodoCommentValidator, updateTodoCommentValidator } = require('../../validators');

const mutations = {
  addTodoComment: async (root, args, context) => {
    await ContextMiddleware(context, addTodoCommentValidator({ ...args.input, todoId: args.todoId }));
    return TodoCommentService.addTodoComment(context, args, args.input);
  },
  updateTodoComment: async (root, args, context) => {
    await ContextMiddleware(context, updateTodoCommentValidator({ ...args.input, todoId: args.todoId, id: args.id }));
    return TodoCommentService.updateTodoComment(context, args, args.input);
  }
};

module.exports = {
  mutations
};
