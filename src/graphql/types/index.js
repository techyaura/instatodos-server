const successType = require('./success/success.type');
const toDoTypes = require('./todo');
const userTypes = require('./user');

module.exports = {
  successType,
  toDoType: toDoTypes.toDoType,
  toDoInputType: toDoTypes.toDoInputType,
  userInfoType: userTypes.userInfoType,
  userLoginSuccessType: userTypes.userLoginSuccessType,
  userLoginInputType: userTypes.userLoginInputType,
  userRegisterInputType: userTypes.userRegisterInputType,
  userRegisterSuccessType: userTypes.userRegisterSuccessType
};
