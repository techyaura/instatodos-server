
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'TodoList',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    status: {
      type: GraphQLBoolean
    },
    isDeleted: {
      type: GraphQLBoolean
    }
  }
});
