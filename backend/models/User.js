const mongoose = require('mongoose')


const userSchema = new mongoose.Schema(
  {
    storeId:{
      type: mongoose.Types.ObjectId,
      ref: 'store',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      enum: ['user', 'admin', 'superAdmin', 'banned'],
      default: 'user'
    },
    fullName: {
      type: String,
    },
    address: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    phone: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode:{
      type: String,
    }
  },
  {
    timestamps: true,
  }

)

const User = mongoose.model('user', userSchema)
module.exports = User
