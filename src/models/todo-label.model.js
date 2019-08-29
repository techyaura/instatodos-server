const mongoose = require('mongoose');


const { Schema } = mongoose;

const { ObjectId } = Schema;

const schema = new mongoose.Schema({
  user: {
    type: ObjectId, ref: 'User'
  },
  name: {
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

const TodoLabelModel = mongoose.model('TodoLabel', schema);

module.exports = TodoLabelModel;
