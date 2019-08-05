const {
  registerValidator,
  loginValidator,
  registerVerificationValidator
} = require('./auth.validator');

const {
  addTodoValidator,
  updateTodoValidator
} = require('./todo.validator');


const validators = {
  registerValidator,
  registerVerificationValidator,
  loginValidator,
  addTodoValidator,
  updateTodoValidator
};

module.exports = validators;
