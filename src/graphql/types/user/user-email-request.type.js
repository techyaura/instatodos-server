
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'EmailRequestSuccessType',
  fields: {
    message: {
      type: new GraphQLNonNull(GraphQLString)
    },
    hashToken: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
