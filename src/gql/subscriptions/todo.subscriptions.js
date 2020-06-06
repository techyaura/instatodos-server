const { POST_ADDED, pubSub } = require('../events');

module.exports = {
  postAdded: {
    // Additional event labels can be passed to asyncIterator creation
    subscribe: () => pubSub.asyncIterator([POST_ADDED])
  }
};
