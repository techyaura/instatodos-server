class TemplateService {
  constructor() {
    this.TemplateModel = require('../../config/mock.json');
  }

  fetch(templateName) {
    return new Promise((resolve, reject) => {
      if (!templateName) {
        return reject(new Error('No Template Found'));
      }
      const template = this.TemplateModel.templates[templateName];
      return resolve(template);
    });
  }
}

module.exports = new TemplateService();
