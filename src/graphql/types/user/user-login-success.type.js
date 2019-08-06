
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

const userInfoType = require('./user-info.type');

module.exports = new GraphQLObjectType({
  name: 'UserLoginSuccessType',
  fields: {
    message: {
      type: new GraphQLNonNull(GraphQLString)
    },
    token: {
      type: new GraphQLNonNull(GraphQLString)
    },
    user: {
      type: new GraphQLNonNull(userInfoType)
    }
  }
});
