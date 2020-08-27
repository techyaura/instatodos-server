const mongoose = require('mongoose');

const { Schema } = mongoose;

const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;

const modelSchema = new Schema(
  {
    // Google ID
    gId: {
      type: String
    },
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    country: { type: String },
    timezone: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    otp: { type: String },
    hashToken: { type: String },
    profilePic: {
      url: String,
      publicId: String,
      mimetype: String,
      filename: String
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: false
    },
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false
    }
  },
  { timestamps: {} }
);

/* eslint func-names: 0 */
modelSchema.pre('save', function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  return bcrypt.genSalt(SALT_WORK_FACTOR, (err1, salt) => {
    if (err1) return next(err1);

    // hash the password using our new salt
    return bcrypt.hash(user.password, salt, null, (err2, hash) => {
      if (err2) return next(err2);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

modelSchema.pre('beforeUpdate', (values, next) => bcrypt.genSalt(10, (err, salt) => {
  if (err) return next(err);
  if (values.password) {
    // code
    return bcrypt.hash(values.password, salt, (err1, hash) => {
      const valuesObj = values;
      if (err1) return next(err1);
      valuesObj.password = hash;
      return next();
    });
  }
  return next();
}));

modelSchema.methods.comparePassword = (password, user, cb) => bcrypt.compare(password, user.password, (err, match) => {
  if (err) return cb(err);
  if (match) {
    return cb(null, true);
  }
  return cb(null, false);
});

modelSchema.set('toObject', { virtuals: true });
modelSchema.set('toJSON', { virtuals: true });

const UserModel = mongoose.model('User', modelSchema);
module.exports = UserModel;
