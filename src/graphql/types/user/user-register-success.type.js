
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UserRegisterSuccessType',
  fields: {
    message: {
      type: new GraphQLNonNull(GraphQLString)
    },
    registerHash: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
