const { ThoughtService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  listThought: async (root, args, context) => {
    await ContextMiddleware(context);
    console.log(args);
    return ThoughtService.listThought(context, args);
  }
};
