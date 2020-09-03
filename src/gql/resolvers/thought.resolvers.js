const { ThoughtService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');
const { addThoughtValidator, updateThoughtValidator } = require('../../validators');

const queries = {
  listThought: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return ThoughtService.listThought(context, args);
    } catch (err) {
      throw err;
    }
  }
};

const mutations = {
  addThought: async (_, args, context) => {
    try {
      await ContextMiddleware(context, addThoughtValidator(args.input));
      return ThoughtService.addThought(context, args.input);
    } catch (err) {
      throw err;
    }
  },
  updateThought: async (_, args, context) => {
    try {
      await ContextMiddleware(context, updateThoughtValidator({ ...args.input, id: args.id }));
      return ThoughtService.updateThought(context, { thoughtId: args.id }, args.input);
    } catch (err) {
      throw err;
    }
  },
  deleteThought: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return ThoughtService.deleteThought(context, { thoughtId: args.id });
    } catch (err) {
      throw err;
    }
  }
};

module.exports = {
  queries,
  mutations
};
