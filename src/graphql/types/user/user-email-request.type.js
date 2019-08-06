
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'EmailRequestSuccessType',
  fields: {
    ok: {
      type: GraphQLBoolean
    },
    message: {
      type: new GraphQLNonNull(GraphQLString)
    },
    hashToken: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
