const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const { ObjectId } = Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },

  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 64,
  },
  picture: {
    type: String,
    default: '/avatar.png',
  },
  role: {
    type: [String],
    default: ['user'],
    enum: ['user', 'instructor', 'admin'],
  },
  stripe_account_id: String,
  stripe_seller: {},
  stripeSession: {},
  passwordResetCode: {
    data: {
      type: String,
      default: '',
    },
  },


  courses: [{ type: ObjectId, ref: 'Course' }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;