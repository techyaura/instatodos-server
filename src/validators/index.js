const authValidator = require('./auth.validator');

const todoValidator = require('./todo.validator');

const todoLabelValidator = require('./todo-label.validator');

const validators = {
  ...authValidator,
  ...todoValidator,
  ...todoLabelValidator
};

module.exports = validators;
