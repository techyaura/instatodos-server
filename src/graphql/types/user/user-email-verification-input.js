
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLInputObjectType(
  {
    name: 'EmailVerificationInputType',
    fields: {
      hashToken: {
        type: new GraphQLNonNull(GraphQLString)
      },
      otp: {
        type: new GraphQLNonNull(GraphQLString)
      }
    }
  }
);
