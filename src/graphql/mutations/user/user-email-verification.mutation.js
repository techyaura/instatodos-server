const { UserService } = require('../../../services');

const { emailRequestSuccessType, emailVerificationInputType } = require('../../types');

const { registerVerificationValidator } = require('../../../validators');

module.exports = {
  type: emailRequestSuccessType,
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
