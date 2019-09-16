const AuthMiddleware = require('./auth.middleware');
const ContextMiddleware = require('./context.middleware');
const TodoMiddlewares = require('./todo.middlewares');

module.exports = {
  AuthMiddleware,
  ContextMiddleware,
  TodoMiddlewares
};
