

const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'TodoSuccessType',
  fields: {
    ok: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    message: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
