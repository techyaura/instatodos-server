const { ThoughtService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  listThought: async (root, args, context) => {
    await ContextMiddleware(context);
    return ThoughtService.listThought(context);
  }
};
