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
  title: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isInProgress: {
    type: Boolean,
    default: false
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
