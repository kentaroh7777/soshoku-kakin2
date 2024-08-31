import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../next.config.mjs'

const userSchema = new mongoose.Schema({
  customerId: { // Master key
    type: String,
    unique: true,
    required: [true, 'Customer IDを入力してください'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return v==='' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  password: {
    type: String,
    required: [true, 'パスワードを入力してください'],
    validate: {
      validator: function(v: string) {
        return /^[\x21-\x7E]*$/.test(v);
      },
      message: 'invalid password. Only alphabet, number, and symbols are allowed.'
    },
    minlength: 8,
    maxlength: 64
  },
  nickname: {
    type: String,
    maxlength: 32,
    default: "User"
  },
  profileText: {
    type: String,
    maxlength: 1024,
    default: ""
  },
  profilePicture: {
    type: String,
    // validate: {
    //   validator: function(v: string) {
    //     return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
    //   },
    //   message: props => `${props.value} は有効なURLではありません`
    // },
    default: ""
  },
  permission: {
    type: String, // 'admin' or 'user'
    default: 'user'
  }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const userFindByToken = async function(token: string) {
  const decoded = jwt.verify(token, JWT_SECRET()) as jwt.JwtPayload;
  if (!decoded) {
    return null;
  } else {
    return User.findById(decoded.userId);
  }
}

export const User = mongoose.models.User || mongoose.model('User', userSchema)