const todoMutations = require('./todo.mutations');
const todolabelMutations = require('./todo-label.mutations');
const userMutations = require('./user.mutations');
const thoughtMutaions = require('./thought.mutations');
const projectMutaions = require('./project.mutations');

const mutations = {
  Mutation: {
    ...todoMutations,
    ...todolabelMutations,
    ...userMutations,
    ...thoughtMutaions,
    ...projectMutaions
  }
};

module.exports = mutations;
