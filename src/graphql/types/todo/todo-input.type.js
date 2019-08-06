
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLInputObjectType({
  name: 'TodoInputType',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
