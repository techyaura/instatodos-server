const { TodoLabelModel } = require('../models');

module.exports = {
  checkLabel: (context, postBody) => {
    const { next } = context;
    return TodoLabelModel.findOne({ _id: postBody.label })
      .then((label) => {
        if (label) {
          return next();
        }
        return Promise.reject(new Error('Invalid Todo Label'));
      });
  }


};
