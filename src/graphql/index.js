const {
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql');

const queries = require('./queries');
const mutations = require('./mutations');

// console.log(queries);

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutations
  })
});
