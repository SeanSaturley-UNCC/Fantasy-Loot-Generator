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
      select: false // * when calling User.find(...) it will automatically hide the password (for security)
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword.toString(), this.password.toString())
}

const User = mongoose.model('User', userSchema);

module.exports = User;
