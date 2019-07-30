
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UserRegister',
  fields: {
    message: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
