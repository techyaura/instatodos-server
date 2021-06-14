const configSettingModel = require('../../models/configuration.model');

class SettingService {
  // constructor() {}

  // eslint-disable-next-line class-methods-use-this
  async configureSetting(user) {
    // eslint-disable-next-line new-cap
    const config = new configSettingModel({
      userId: user._id
    });
    await config.save();
  }

  // eslint-disable-next-line class-methods-use-this
  async setting({ user }) {
    const response = await configSettingModel.findOne({ userId: user._id }).lean();
    if (response) {
      return response;
    }
    // default settings for already existing users
    return {
      theme: 'rgb(255, 0, 0)'
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async update({ user }, postBody) {
    const update = {};
    if (typeof (postBody.theme) !== 'undefined' && postBody.theme) {
      update.theme = postBody.theme;
    }
    const response = await configSettingModel.findOneAndUpdate({ userId: user._id }, { $set: update }, { upsert: true, new: true }).lean();
    return response;
  }
}

module.exports = new SettingService();
