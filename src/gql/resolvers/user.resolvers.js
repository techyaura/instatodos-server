const { loginValidator } = require('../../validators');
const { ContextMiddleware } = require('../../middlewares');
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

/**
 * User GQL Queries
 */
const queries = {
  login: async (_, args, context) => {
    try {
      const { res, next } = context;
      await loginValidator(args.input, res, next);
      return UserService.login(args.input);
    } catch (err) {
      throw err;
    }
  },
  profile: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return UserService.profile(context);
    } catch (err) {
      throw err;
    }
  }
};

/**
 * User GQL Mutations
 */
const mutations = {
  register: async (_, args, context) => {
    try {
      const otp = CommonFunctionUtil.generateOtp();
      const hashToken = CommonFunctionUtil.generateHash();
      const refreshToken = CommonFunctionUtil.generateHash();
      const { res, next } = context;
      await registerValidator(args.input, res, next);
      const { email } = args.input;
      await UserService.checkUniqueEmail(email);
      const user = await UserService.register({
        ...args.input, otp, hashToken, refreshToken
      });
      const templateObject = await TemplateService.fetch('USER_REGISTER');
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
    } catch (err) {
      throw err;
    }
  },
  emailVerificationByOtp: async (_, args, context) => {
    try {
      const { res, next } = context;
      await registerVerificationValidator(args.input, res, next);
      return UserService.registerVerificationByOtp({ ...args.input });
    } catch (err) {
      throw err;
    }
  },
  userForgotpassword: async (_, args, context) => {
    const { res, next } = context;
    await emailValidator(args.input, res, next);
    const otp = CommonFunctionUtil.generateOtp();
    const hashToken = CommonFunctionUtil.generateHash();
    const user = await UserService.forgotPasswordByOtp({ ...args.input, otp, hashToken });
    const templateObject = await TemplateService.fetch('USER_REGISTER');
    const { email } = user;
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
  },
  userResetPassword: async (_, args, context) => {
    try {
      const { res, next } = context;
      await resetPasswordValidator(args.input, res, next);
      await UserService.resetPassword({ ...args.input });
      return ({ message: 'Password reset successfully', ok: true });
    } catch (err) {
      throw err;
    }
  },
  updateProfile: async (_, args, context) => {
    try {
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
    } catch (err) {
      throw err;
    }
  },
  updatePassword: async (_, args, context) => {
    try {
      await ContextMiddleware(context, passwordValidator(args.input));
      return UserService.updatePassword(context, { ...args.input });
    } catch (err) {
      throw err;
    }
  },
  refreshToken: async (_, args, context) => {
    try {
      await ContextMiddleware(context);
      return UserService.refreshToken(context, args.input);
    } catch (err) {
      throw err;
    }
  }
};

module.exports = {
  queries,
  mutations
};
