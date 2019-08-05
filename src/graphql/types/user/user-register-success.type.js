
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UserRegisterSuccessType',
  fields: {
    message: {
      type: GraphQLString
    },
    registerHash: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
