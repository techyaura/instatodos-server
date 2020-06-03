const mongoose = require('mongoose');


const { Schema } = mongoose;

const { ObjectId } = Schema;

const schema = new mongoose.Schema({
  user: {
    type: ObjectId, ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  accomplishTenure: {
    type: Date,
    default: null
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isAchieved: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: {}
});

const ThoughtModel = mongoose.model('Thought', schema);

module.exports = ThoughtModel;
