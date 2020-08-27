const { ThoughtService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addThoughtValidator, updateThoughtValidator } = require('../../validators');

const queries = {
  listThought: async (root, args, context) => {
    await ContextMiddleware(context);
    return ThoughtService.listThought(context, args);
  }
};

const mutations = {
  addThought: async (root, args, context) => {
    await ContextMiddleware(context, addThoughtValidator(args.input));
    return ThoughtService.addThought(context, args.input);
  },
  updateThought: async (root, args, context) => {
    await ContextMiddleware(context, updateThoughtValidator({ ...args.input, id: args.id }));
    return ThoughtService.updateThought(context, { thoughtId: args.id }, args.input);
  },
  deleteThought: async (root, args, context) => {
    await ContextMiddleware(context);
    return ThoughtService.deleteThought(context, { thoughtId: args.id });
  }
};

module.exports = {
  queries,
  mutations
};
