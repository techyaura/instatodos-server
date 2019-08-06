const {
  registerValidator,
  loginValidator,
  registerVerificationValidator,
  emailValidator,
  resetPasswordValidator
} = require('./auth.validator');

const {
  addTodoValidator,
  updateTodoValidator
} = require('./todo.validator');


const validators = {
  registerValidator,
  registerVerificationValidator,
  emailValidator,
  loginValidator,
  addTodoValidator,
  updateTodoValidator,
  resetPasswordValidator
};

module.exports = validators;
