

const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLNonNull
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'ok',
  fields: {
    ok: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  }
});
