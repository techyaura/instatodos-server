const { UserService } = require('../../services');
const { loginValidator } = require('../../validators');

module.exports = {
  login: (root, args, context) => {
    const { res, next } = context;
    return loginValidator(args.input, res, next).then(() => UserService.login(args.input));
  }
};
