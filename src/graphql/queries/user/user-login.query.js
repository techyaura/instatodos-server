const {
  GraphQLNonNull
} = require('graphql');

const { UserService } = require('../../../services');

const { userLoginSuccessType, userLoginInputType } = require('../../types');

const { loginValidator } = require('../../../validators');

module.exports = {
  type: userLoginSuccessType,
  args: {
    input: {
      type: new GraphQLNonNull(userLoginInputType)
    }
  },
  resolve(root, args, context) {
    const { res, next } = context;
    return loginValidator(args.input, res, next).then(() => UserService.login(args.input))
      .then(response => response)
      .catch(err => next(err));
  }
};
