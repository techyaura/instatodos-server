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
  status: {
    type: Boolean,
    default: true
  },
  isCompleted: {
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

const TodoModel = mongoose.model('Todo', schema);

module.exports = TodoModel;
