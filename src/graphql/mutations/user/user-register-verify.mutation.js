const { UserService } = require('../../../services');

const { successType, emailVerificationInputType } = require('../../types');

const { registerVerificationValidator } = require('../../../validators');

module.exports = {
  type: successType,
  args: {
    input: {
      type: emailVerificationInputType
    }
  },
  resolve(root, args, context) {
    const { res, next } = context;
    return registerVerificationValidator(args.input, res, next)
      .then(() => UserService.registerVerificationByOtp({ ...args.input }))
      .then(response => ({ ...response, ok: true }))
      .catch(err => next(err));
  }
};
