const todoMutations = require('./todo.mutations');
const todolabelMutations = require('./todo-label.mutations');
const userMutations = require('./user.mutations');

const mutations = {
  Mutation: {
    ...todoMutations,
    ...todolabelMutations,
    ...userMutations
  }
};

module.exports = mutations;
