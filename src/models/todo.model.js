const mongoose = require('mongoose');


const { Schema } = mongoose;

const { ObjectId } = Schema;

const commentSchema = new Schema({
  description: {
    type: String
  },
  userId: {
    type: ObjectId, ref: 'User'
  }
}, {
  timestamps: {}
});

const schema = new mongoose.Schema({
  parent: {
    type: ObjectId, ref: 'Todo'
  },
  user: {
    type: ObjectId, ref: 'User'
  },
  labelIds: {
    type: [ObjectId],
    ref: 'TodoLabel',
    default: null
  },
  projectId: {
    type: ObjectId,
    ref: 'Project',
    default: null
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['P1', 'P2', 'P3', 'P4'],
    default: 'P4'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isInProgress: {
    type: Boolean,
    default: false
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  comments: [commentSchema]
},
{
  timestamps: {}
});

const TodoModel = mongoose.model('Todo', schema);

module.exports = TodoModel;
