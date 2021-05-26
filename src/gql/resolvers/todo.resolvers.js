const { POST_ADDED, pubSub } = require('../events');

const { TodoService } = require('../../services');
const { ContextMiddleware, TodoMiddlewares } = require('../../middlewares');
const {
  addTodoValidator, updateTodoValidator, addTodoCommentValidator, updateTodoCommentValidator, subTodoValidator, subTodoUpdateValidator
} = require('../../validators');

const queries = {
  todoList: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return TodoService.listTodo(context, args);
    } catch (err) {
      throw err;
    }
  },
  todoView: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return TodoService.viewTodo(args);
    } catch (err) {
      throw err;
    }
  },
  todoCompleted: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return TodoService.completedTodo(context, args);
    } catch (err) {
      throw err;
    }
  },
  todoUpcoming: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return TodoService.upcomingTodo(context, args);
    } catch (err) {
      throw err;
    }
  }
};

const mutations = {
  addSubTodo: async (_, args, context) => {
    try {
      await ContextMiddleware(context, subTodoValidator(args.input));
      return TodoService.addSubTodo(context, args.input);
    } catch (err) {
      throw err;
    }
  },
  updateSubTodo: async (_, args, context) => {
    try {
      await ContextMiddleware(context, subTodoUpdateValidator(args.input));
      return TodoService.updateSubTodo(context, args, args.input);
    } catch (err) {
      throw err;
    }
  },
  addTodo: async (_, args, context) => {
    try {
      await ContextMiddleware(context, addTodoValidator(args.input));
      return TodoService.addTodo(context, args.input);
    } catch (err) {
      throw err;
    }
  },
  updateTodo: async (_, args, context) => {
    try {
      await ContextMiddleware(context, updateTodoValidator({ ...args.input, id: args.id }), TodoMiddlewares.checkLabel(context, args.input));
      return TodoService.updateTodo(context, args, args.input);
    } catch (err) {
      throw err;
    }
  },
  deleteTodo: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return TodoService.deleteTodo(context, args);
    } catch (err) {
      throw err;
    }
  },
  addTodoComment: async (_, args, context) => {
    try {
      await ContextMiddleware(context, addTodoCommentValidator({ ...args.input, todoId: args.todoId }));
      return TodoService.addTodoComment(context, args, args.input);
    } catch (err) {
      throw err;
    }
  },
  updateTodoComment: async (_, args, context) => {
    try {
      await ContextMiddleware(context, updateTodoCommentValidator({ ...args.input, todoId: args.todoId, id: args.id }));
      return TodoService.updateTodoComment(context, args, args.input);
    } catch (err) {
      throw err;
    }
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
