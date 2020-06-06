const todoSubscriptions = require('./todo.subscriptions');

const resolvers = {
  Subscription: {
    ...todoSubscriptions
  }
};

module.exports = resolvers;
