const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { UserService } = require('../../../services');

const { userRegisterType } = require('../../types');

const { registerValidator } = require('../../../validators');

module.exports = {
  type: userRegisterType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve(root, args, context) {
    const { res, next } = context;
    return registerValidator(args, res, next).then(() => UserService.register(args))
      .then(response => ({ message: response.message }))
      .catch(err => next(err));
  }
};
