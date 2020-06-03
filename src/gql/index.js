const { makeExecutableSchema } = require('graphql-tools');
const queries = require('./queries');
const mutations = require('./mutations');
const subscriptions = require('./subscriptions');

const types = require('./types');

const resolvers = {
  ...queries,
  ...mutations,
  ...subscriptions
};

const schema = makeExecutableSchema({
  typeDefs: types,
  resolvers
});

module.exports = schema;
