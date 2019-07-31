
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UserRegisterType',
  fields: {
    message: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
