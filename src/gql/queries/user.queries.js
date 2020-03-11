const { UserService } = require('../../services');
const { loginValidator } = require('../../validators');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  login: async (root, args, context) => {
    const { res, next } = context;
    await loginValidator(args.input, res, next);
    return UserService.login(args.input);
  },
  profile: async (root, args, context) => {
    await ContextMiddleware(context);
    return UserService.profile(context);
  }
};
