const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema;

const schema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  theme: {
    type: String,
    default: 'rgb(255, 0, 0)'
  },
  lang: {
    type: String,
    default: 'en',
    enum: ['en', 'fr', 'es', 'hi']
  }
},
{
  timestamps: {}
});

const ConfigSetting = mongoose.model('Configuration', schema);

module.exports = ConfigSetting;
