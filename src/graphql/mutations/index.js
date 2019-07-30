const addTodo = require('./todo/add-todo');
const updateTodo = require('./todo/update-todo');
const deleteTodo = require('./todo/delete-todo');
const register = require('./user/user.register.mutation');

module.exports = {
  addTodo,
  updateTodo,
  deleteTodo,
  register
};
