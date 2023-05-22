const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT} = require('../config/config')
const User = require('../models/User')

const checkPassword = (password, passwordHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        reject(err)
      }
      resolve(same)
    })
  })
}

const newToken = (user, store) => {
  return jwt.sign({id: user._id, role: user.role, storeId: store._id}, JWT.jwt, {
    expiresIn: JWT.jwtExp,
  })
}

const recoverPassword = async (email, storeId) => {
  try {
    const user = await User.findOne({email, storeId})
    if (!!!user) {
      return sendResponseError(400, 'User not found', res)
    }
    const token = newToken({
      user: user,
      expiresIn: '1h',
    })
    resolve(token)
  }catch (err) {
    console.log('Error : ', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
})

const createRandom4DigitCode = () => {
  const code = Math.floor(Math.random() * 9000) + 1000
  return code
}

const createRandom8DigitCode = () => {
  const code = Math.floor(Math.random() * 9000000) + 1000000
  return code
}



module.exports = {checkPassword, newToken, verifyToken, recoverPassword, createRandom4DigitCode, createRandom8DigitCode}
