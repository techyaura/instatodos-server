const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { UserService } = require('../../../services');

const { userRegisterType } = require('../../types');

module.exports = {
  type: userRegisterType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => UserService.register(args)
    .then(response => ({ message: response.message }))
    .catch(err => err)
};
