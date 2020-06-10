const { ProjectService } = require('../../services');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  todoProjectList: async (root, args, context) => {
    await ContextMiddleware(context);
    return ProjectService.todoProjectListCount(context);
  }
};
