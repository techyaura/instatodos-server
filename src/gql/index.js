const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require('./resolvers');
const typeDefs = require('./types');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
