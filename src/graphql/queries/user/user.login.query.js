const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { UserService } = require('../../../services');

const { userLoginType } = require('../../types');

const { loginValidator } = require('../../../validators');

module.exports = {
  type: userLoginType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve(root, args, context) {
    const { res, next } = context;
    return loginValidator(args, res, next).then(() => UserService.login(args))
      .then(response => response)
      .catch(err => next(err));
  }
};
