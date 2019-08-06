const { JwtUtil } = require('../../utils');

const { UserModel } = require('../../models');

class AuthService {
  constructor() {
    this.JwtService = JwtUtil;
    this.UserModel = UserModel;
  }

  checkUniqueEmail(email) {
    return this.UserModel.findOne({ email })
      .then((response) => {
        if (response) {
          return Promise.reject(new Error('Email address not available'));
        }
        return Promise.resolve(true);
      })
      .catch(err => Promise.reject(err));
  }

  register(postBody) {
    return this.UserModel(postBody)
      .save()
      .then(() => Promise.resolve({ message: 'User succsessfully registered', ...postBody }))
      .catch(err => Promise.reject(err));
  }

  registerVerificationByOtp(postBody) {
    return this.UserModel.findOneAndUpdate({
      otp: postBody.otp,
      registerHash: postBody.registerHash,
      status: false
    },
    {
      status: true,
      registerHash: '',
      otp: ''
    },
    {
      upsert: false,
      new: true
    })
      .then((response) => {
        if (!response) {
          return Promise.reject(new Error('No User Found'));
        }
        return Promise.resolve({
          message: 'User succsessfully registered',
          ...response
        });
      })
      .catch(err => Promise.reject(err));
  }

  login(postBody) {
    return this.UserModel.findOne(
      {
        isDeleted: false,
        status: true,
        email: postBody.email
      }
    )
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error('No_User_Found'));
        }
        return new Promise((resolve, reject) => new UserModel().comparePassword(postBody.password, user, (err, valid) => {
          if (err) {
            reject(err);
          }
          if (!valid) {
            return reject(new Error('INVALID_CREDENTIALS'));
          }
          const token = this.JwtService.issueToken(
            user._id /* eslint no-underscore-dangle: 0 */,
          );
          return resolve({
            message: 'User successfully logged in',
            token,
            user: {
              email: user.email,
              _id: user._id
            }
          });
        }));
      })
      .catch(err => Promise.reject(err));
  }
}

module.exports = new AuthService();
