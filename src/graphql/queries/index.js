const todoQueries = require('./todo');
const login = require('./user/user.login.query');

module.exports = {
  todoList: todoQueries.todoList,
  todoView: todoQueries.todoView,
  login
};
