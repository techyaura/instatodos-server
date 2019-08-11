const todoMutations = require('./todo.mutations');
const userMutations = require('./user.mutations');

const mutations = {
  Mutation: {
    ...todoMutations,
    ...userMutations
  }
};

module.exports = mutations;
