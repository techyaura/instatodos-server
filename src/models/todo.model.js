const mongoose = require('mongoose');


const { Schema } = mongoose;

const { ObjectId } = Schema;

const commentSchema = new Schema({
  description: {
    type: String
  }
}, {
  timestamps: {}
});

const schema = new mongoose.Schema({
  user: {
    type: ObjectId, ref: 'User'
  },
  label: {
    type: [ObjectId],
    ref: 'TodoLabel',
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
    enum: ['p1', 'p2', 'p3', 'p4'],
    default: 'p4'
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
    default: new Date()
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
