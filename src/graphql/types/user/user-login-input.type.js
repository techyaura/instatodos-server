
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLInputObjectType(
  {
    name: 'UserLoginInputType',
    fields: {
      email: {
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        type: new GraphQLNonNull(GraphQLString)
      }
    }
  }
);
