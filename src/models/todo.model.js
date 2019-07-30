const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  title: {
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

const TodoModel = mongoose.model('Todo', schema);

module.exports = TodoModel;
