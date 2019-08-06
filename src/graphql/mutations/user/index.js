const register = require('./user-register.mutation');
const emailVerificationByOtp = require('./user-register-verify.mutation');
const userForgotPassword = require('./user-forgot-password');
const userResetPassword = require('./user-reset-password');

module.exports = {
  register,
  emailVerificationByOtp,
  userForgotPassword,
  userResetPassword
};
