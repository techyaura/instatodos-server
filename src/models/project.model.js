const mongoose = require('mongoose');


const { Schema } = mongoose;

const { ObjectId } = Schema;

const schema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: {}
});

const ProjectModel = mongoose.model('Project', schema);

module.exports = ProjectModel;
