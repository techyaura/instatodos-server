const todoMuatations = require('./todo');
const userMuatations = require('./user');

module.exports = {
  addTodo: todoMuatations.addTodo,
  updateTodo: todoMuatations.updateTodo,
  deleteTodo: todoMuatations.deleteTodo,
  register: userMuatations.register,
  emailVerificationByOtp: userMuatations.emailVerificationByOtp,
  userForgotPassword: userMuatations.userForgotPassword,
  userResetPassword: userMuatations.userResetPassword
};
