const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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
    },
    
    
    // May or may not remove this
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// hashes the users' password before saving
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model('User', userSchema);

module.exports = User;
