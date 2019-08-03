const { JwtUtil } = require('../../utils');

const { UserModel } = require('../../models');

class AuthService {
  constructor() {
    this.JwtService = JwtUtil;
    this.UserModel = UserModel;
  }

  register(postBody) {
    return this.UserModel(postBody)
      .save()
      .then(() => ({
        message: 'User succsessfully registered',
        ...postBody
      }))
      .catch(err => err);
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
          return new Error('No_User_Found');
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
      .catch(err => err);
  }
}

module.exports = new AuthService();
