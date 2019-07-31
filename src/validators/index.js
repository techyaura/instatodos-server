const {
  registerValidator,
  loginValidator
} = require('./auth.validator');

const {
  addTodoValidator,
  updateTodoValidator
} = require('./todo.validator');


const validators = {
  registerValidator,
  loginValidator,
  addTodoValidator,
  updateTodoValidator
};

module.exports = validators;
