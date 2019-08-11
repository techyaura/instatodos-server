const { makeExecutableSchema } = require('graphql-tools');
const queries = require('./queries');
const mutations = require('./mutations');

const types = require('./types');

const resolvers = {
  ...queries,
  ...mutations
};

const schema = makeExecutableSchema({
  typeDefs: types,
  resolvers
});

module.exports = schema;
