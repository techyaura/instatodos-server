const { TodoService } = require('../../services');

module.exports = {
  todoList: () => TodoService.listTodo(),
  todoView: (root, args) => TodoService.viewTodo(args)
};
