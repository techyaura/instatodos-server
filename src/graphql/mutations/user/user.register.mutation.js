const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { UserService } = require('../../../services');

const userRegister = require('../../types/user/user.register.type');

module.exports = {
  type: userRegister,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => UserService.register(args)
    .then(response => ({ message: response.message }))
    .catch(err => err)
};
