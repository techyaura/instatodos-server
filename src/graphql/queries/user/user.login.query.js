const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { UserService } = require('../../../services');

const { userLoginType } = require('../../types');

module.exports = {
  type: userLoginType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve(root, args, context, info) {
    return UserService.login(args)
      .then(response => response)
      .catch(err => err);
  }
};
