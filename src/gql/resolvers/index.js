const { mutations: UserMutation, queries: UserQuery } = require('./user.resolvers');
const { mutations: TodoMutation, queries: TodoQuery, subscriptions: TodoSubscription } = require('./todo.resolvers');
const { mutations: TodoLabelMutation, queries: TodoLabelQuery } = require('./todo-label.resolvers');
const { mutations: TodoCommentMutation } = require('./todo-comment-resolvers');

const { mutations: ThoughtMutation, queries: ThoughtQuery } = require('./thought.resolvers');
const { mutations: ProjectMutation, queries: ProjectQuery } = require('./project.resolvers');
const { mutations: SocialLoginMutation } = require('./social-login.resolvers');

const { queries: SettingQuery, mutations: SettingMutation } = require('./setting.resolvers');

module.exports = {
  Mutation: {
    ...UserMutation, ...SocialLoginMutation, ...TodoMutation, ...TodoLabelMutation, ...ThoughtMutation, ...ProjectMutation, ...TodoCommentMutation, ...SettingMutation
  },
  Query: {
    ...UserQuery, ...TodoQuery, ...TodoLabelQuery, ...ThoughtQuery, ...ProjectQuery, ...SettingQuery
  },
  Subscription: {
    ...TodoSubscription
  }
};
