const { SocialLoginService } = require('../../services');

const mutations = {
  googleLogin: (root, args) => SocialLoginService.googleLogin(args.input)
};

module.exports = {
  mutations
};
