const settingService = require('../../services/settings/settings.service');
const { ContextMiddleware } = require('../../middlewares');
const { configSettingValidator } = require('../../validators');

const queries = {
  setting: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return await settingService.setting(context);
    } catch (err) {
      throw err;
    }
  }
};

const mutations = {
  setting: async (_, args, context) => {
    try {
      await ContextMiddleware(context, configSettingValidator(args.input));
      return await settingService.update(context, args.input);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = {
  queries,
  mutations
};
