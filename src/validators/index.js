const authValidator = require('./auth.validator');

const todoValidator = require('./todo.validator');

const todoLabelValidator = require('./todo-label.validator');

const thoughtValidator = require('./thought.validator');

const projectValidator = require('./project.validator');

const validators = {
  ...authValidator,
  ...todoValidator,
  ...todoLabelValidator,
  ...thoughtValidator,
  ...projectValidator
};

module.exports = validators;
