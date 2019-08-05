const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType
} = require('graphql');

const { UserService } = require('../../../services');

const { successType } = require('../../types');

const { registerVerificationValidator } = require('../../../validators');

module.exports = {
  type: successType,
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'UserRegisterVerificationType',
        fields: {
          otp: {
            type: new GraphQLNonNull(GraphQLString)
          },
          registerHash: {
            type: new GraphQLNonNull(GraphQLString)
          }
        }
      })
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
