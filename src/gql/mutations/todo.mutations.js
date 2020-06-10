const { POST_ADDED, pubSub } = require('../events');

const { TodoService, ProjectService } = require('../../services');
const { ContextMiddleware, TodoMiddlewares } = require('../../middlewares');
const {
  addTodoValidator, updateTodoValidator, addTodoCommentValidator, updateTodoCommentValidator
} = require('../../validators');

module.exports = {
  addTodo: async (root, args, context) => {
    // pubSub.publish(POST_ADDED, { postAdded: { title: args.input.title } });
    await ContextMiddleware(context, addTodoValidator(args.input));
    return TodoService.addTodo(context, args.input);
  },
  updateTodo: async (root, args, context) => {
    await ContextMiddleware(context, updateTodoValidator({ ...args.input, id: args.id }), TodoMiddlewares.checkLabel(context, args.input));
    return TodoService.updateTodo(context, args, args.input);
  },
  deleteTodo: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.deleteTodo(context, args);
  },
  addTodoComment: async (root, args, context) => {
    await ContextMiddleware(context, addTodoCommentValidator({ ...args.input, todoId: args.todoId }));
    return TodoService.addTodoComment(context, args, args.input);
  },
  updateTodoComment: async (root, args, context) => {
    await ContextMiddleware(context, updateTodoCommentValidator({ ...args.input, todoId: args.todoId, id: args.id }));
    return TodoService.updateTodoComment(context, args, args.input);
  }
};
