const { UserService, TemplateService } = require('../../services');
const { uploadProfileImage } = require('../../utils/upload');
const {
  registerVerificationValidator,
  emailValidator,
  registerValidator,
  resetPasswordValidator,
  passwordValidator
} = require('../../validators');
const { EmailUtil, CommonFunctionUtil } = require('../../utils');
const { ContextMiddleware } = require('../../middlewares');

module.exports = {
  emailVerificationByOtp: (root, args, context) => {
    const { res, next } = context;
    return registerVerificationValidator(args.input, res, next)
      .then(() => UserService.registerVerificationByOtp({ ...args.input }));
  },
  userForgotpassword: (root, args, context) => {
    const { res, next } = context;
    return emailValidator(args.input, res, next)
      .then(() => {
        const otp = CommonFunctionUtil.generateOtp();
        const hashToken = CommonFunctionUtil.generateHash(args.input.email ? args.input.email : '');
        return UserService.forgotPasswordByOtp({ ...args.input, otp, hashToken });
      })
      .then(user => TemplateService.fetch('FORGOT_PASSWORD').then(templateObj => [user, templateObj]))
      .then((response) => {
        const [user, templateObject] = response;
        const { otp, email } = user;
        const username = CommonFunctionUtil.generateUsernameFromEmail(user.email);
        let { template } = templateObject;
        const { subject } = templateObject;
        template = template.replace('{{COMPANY_NAME}}', '');
        template = template.replace('{{COMPANY_URL}}', '');
        template = template.replace('{{OTP}}', otp);
        template = template.replace('{{USERNAME}}', username);
        template = template.replace('{{COMPANY_TAG_LINE}}', '');
        const mailOptions = {
          html: template,
          subject,
          to: email
        };
        EmailUtil.sendViaSendgrid(mailOptions);
        return {
          message: 'An OTP has been sent on your email.',
          hashToken: user.hashToken
        };
      })
      .then(response => ({ ...response }));
  },
  register: (root, args, context) => {
    const otp = CommonFunctionUtil.generateOtp();
    const hashToken = CommonFunctionUtil.generateHash(args.input.email ? args.input.email : '');
    const { res, next } = context;
    return registerValidator(args.input, res, next)
      .then(() => {
        const { email } = args.input;
        return UserService.checkUniqueEmail(email);
      })
      .then(() => UserService.register({ ...args.input, otp, hashToken }))
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
          message: 'An OTP has been sent on your email.',
          hashToken: user.hashToken
        };
      })
      .then(response => ({ ...response }));
  },
  userResetPassword: (root, args, context) => {
    const { res, next } = context;
    return resetPasswordValidator(args.input, res, next)
      .then(() => UserService.resetPassword({ ...args.input }))
      .then(() => ({ message: 'Password reset successfully', ok: true }));
  },
  updateProfile: async (root, args, context) => {
    await ContextMiddleware(context);
    await UserService.updateProfile(context, { ...args.input });
    const stream = typeof (context.body.variables.image) !== 'undefined' ? await context.body.variables.image : null;
    const postBody = {};
    if (stream) {
      const {
        createReadStream, filename, mimetype
      } = stream;
      const publicIdkey = context.user.profilePic && context.user.profilePic.publicId;
      const { url, publicId } = await uploadProfileImage(await createReadStream(), publicIdkey);
      postBody.profilePic = {
        url,
        publicId,
        mimetype,
        filename
      };
    }
    const body = { ...postBody, ...args.input };
    await UserService.updateProfile(context, body);
  },
  updatePassword: async (root, args, context) => {
    await ContextMiddleware(context, passwordValidator(args.input));
    return UserService.updatePassword(context, { ...args.input });
  }
};
