const authValidator = require('./auth.validator');

const todoValidator = require('./todo.validator');

const todoLabelValidator = require('./todo-label.validator');

const thoughtValidator = require('./thought.validator');

const validators = {
  ...authValidator,
  ...todoValidator,
  ...todoLabelValidator,
  ...thoughtValidator
};

module.exports = validators;
