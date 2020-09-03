const { POST_ADDED, pubSub } = require('../events');

const { TodoService } = require('../../services');
const { ContextMiddleware, TodoMiddlewares } = require('../../middlewares');
const {
  addTodoValidator, updateTodoValidator, addTodoCommentValidator, updateTodoCommentValidator
} = require('../../validators');

const queries = {
  todoList: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.listTodo(context, args);
  },
  todoView: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.viewTodo(args);
  },
  todoCompleted: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.completedTodo(context, args);
  },
  todoUpcoming: async (root, args, context) => {
    await ContextMiddleware(context);
    return TodoService.upcomingTodo(context, args);
  }
};

const mutations = {
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

const subscriptions = {
  postAdded: {
    // Additional event labels can be passed to asyncIterator creation
    subscribe: () => pubSub.asyncIterator([POST_ADDED])
  }
};

module.exports = {
  queries,
  mutations,
  subscriptions
};
