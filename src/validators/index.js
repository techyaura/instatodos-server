const authValidator = require('./auth.validator');

const todoValidator = require('./todo.validator');

const validators = {
  ...authValidator,
  ...todoValidator
};

module.exports = validators;
