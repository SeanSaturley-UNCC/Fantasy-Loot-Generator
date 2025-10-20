const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils');


// schema definning
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,

      required: true,
      unique: true,

      trim: true,
    },
    email: {
      type: String,

      required: true,
      unique: true,
      lowercase: true,

      trim: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// hashes the users' password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (err) {
        next(err);
    }
});

// instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;
