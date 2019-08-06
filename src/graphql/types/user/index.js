const userInfoType = require('./user-info.type');
const userLoginSuccessType = require('./user-login-success.type');
const userLoginInputType = require('./user-login-input.type');
const userRegisterInputType = require('./user-register-input.type');
const emailVerificationInputType = require('./user-email-verification-input');
const emailRequestSuccessType = require('./user-email-request.type');
const resetPasswordInputType = require('./user-reset-password-input.type');

module.exports = {
  userInfoType,
  userLoginInputType,
  userLoginSuccessType,
  userRegisterInputType,
  emailRequestSuccessType,
  emailVerificationInputType,
  resetPasswordInputType
};
