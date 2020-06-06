const { PubSub } = require('apollo-server');

module.exports = {
  POST_ADDED: 'POST_ADDED',
  pubSub: new PubSub()
};
