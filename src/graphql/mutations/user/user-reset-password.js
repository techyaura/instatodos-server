const {
  GraphQLNonNull
} = require('graphql');

const { UserService } = require('../../../services');

const { successType, resetPasswordInputType } = require('../../types');

const { resetPasswordValidator } = require('../../../validators');

module.exports = {
  type: successType,
  args: {
    input: {
      type: new GraphQLNonNull(resetPasswordInputType)
    }
  },
  resolve(root, args, context) {
    const { res, next } = context;
    return resetPasswordValidator(args.input, res, next)
      .then(() => UserService.resetPassword({ ...args.input }))
      .then(response => ({ ...response }))
      .catch(err => next(err));
  }
};
