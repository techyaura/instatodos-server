
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLInputObjectType(
  {
    name: 'ResetPasswordInputType',
    fields: {
      password: {
        type: new GraphQLNonNull(GraphQLString)
      },
      hashToken: {
        type: new GraphQLNonNull(GraphQLString)
      },
      confirmPassword: {
        type: new GraphQLNonNull(GraphQLString)
      }
    }
  }
);
