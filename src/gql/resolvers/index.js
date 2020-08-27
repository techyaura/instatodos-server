const { mutations: UserMutation, queries: UserQuery } = require('./user.resolvers');
const { mutations: TodoMutation, queries: TodoQuery, subscriptions: TodoSubscription } = require('./todo.resolvers');
const { mutations: TodoLabelMutation, queries: TodoLabelQuery } = require('./todo-label.resolvers');
const { mutations: ThoughtMutation, queries: ThoughtQuery } = require('./thought.resolvers');
const { mutations: ProjectMutation, queries: ProjectQuery } = require('./project.resolvers');

module.exports = {
  Mutation: {
    ...UserMutation, ...TodoMutation, ...TodoLabelMutation, ...ThoughtMutation, ...ProjectMutation
  },
  Query: {
    ...UserQuery, ...TodoQuery, ...TodoLabelQuery, ...ThoughtQuery, ...ProjectQuery
  },
  Subscription: {
    ...TodoSubscription
  }
};
