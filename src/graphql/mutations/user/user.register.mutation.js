const {
  GraphQLNonNull
} = require('graphql');

const { UserService, TemplateService } = require('../../../services');

const { userRegisterInputType, userRegisterSuccessType } = require('../../types');

const { registerValidator } = require('../../../validators');

const { EmailUtil, CommonFunctionUtil } = require('../../../utils');

module.exports = {
  type: userRegisterSuccessType,
  args: {
    input: {
      type: new GraphQLNonNull(userRegisterInputType)
    }
  },
  resolve(root, args, context) {
    const otp = CommonFunctionUtil.generateOtp();
    const registerHash = CommonFunctionUtil.generateHash(args.input.email ? args.input.email : '');
    const { res, next } = context;
    return registerValidator(args.input, res, next).then(() => UserService.register({ ...args.input, otp, registerHash }))
      .then(user => TemplateService.fetch('USER_REGISTER').then(templateObj => [user, templateObj]))
      .then((response) => {
        const [user, templateObject] = response;
        const username = CommonFunctionUtil.generateUsernameFromEmail(user.email);
        let { template } = templateObject;
        template = template.replace('{{COMPANY_NAME}}', '');
        template = template.replace('{{COMPANY_URL}}', '');
        template = template.replace('{{OTP}}', otp);
        template = template.replace('{{USERNAME}}', username);
        template = template.replace('{{COMPANY_TAG_LINE}}', '');
        const mailOptions = {
          html: template,
          subject: templateObject.subject,
          to: user.email
        };
        EmailUtil.sendViaSendgrid(mailOptions);
        return {
          message: 'An OTP has been send on your email.',
          registerHash: user.registerHash
        };
      })
      .then(response => ({ ...response }))
      .catch(err => next(err));
  }
};
