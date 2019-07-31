const addTodo = require('./todo/todo.add.mutation');
const updateTodo = require('./todo/todo.update.mutation');
const deleteTodo = require('./todo/todo.delete.mutation');
const register = require('./user/user.register.mutation');

module.exports = {
  addTodo,
  updateTodo,
  deleteTodo,
  register
};
