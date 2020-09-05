const { SocialLoginService } = require('../../services');

const mutations = {
  googleLogin: async (_, args) => {
    try {
      return SocialLoginService.googleLogin(args.input);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = {
  mutations
};
