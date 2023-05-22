const User = require('../models/User')
const {verifyToken} = require('../utils/utility.function')

const sendResponseError = (statusCode, msg, res) => {
  res.status(statusCode || 400).send(!!msg ? msg : 'Invalid input !!')
}

const verifyUser = async (req, res, next) => {
  const {authorization} = req.headers
  if (!authorization) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  } else if (!authorization.startsWith('Bearer ')) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  }

  try {
    const payload = await verifyToken(authorization.split(' ')[1])
   
    if (payload) {
      const user = await User.findById(payload.id, {password: 0})

      req['user'] = user

      next()
    } else {
      sendResponseError(400, `you are not authorized`, res)
    }
  } catch (err) {
    console.log('Error ', err)
    sendResponseError(400, `Error ${err}`, res)
  }
}

const verifyAdmin = async (req, res, next) => {
  const {authorization} = req.headers
  if (!authorization) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  } else if (!authorization.startsWith('Bearer ')) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  }

  try {
    const payload = await verifyToken(authorization.split(' ')[1])
    
    if (payload) {
      const user = await User.findById(payload.id, {password: 0})

      if (user.role === 'admin') {
        req['user'] = user
        next()
      } else {
        sendResponseError(400, `you are not authorized`, res)
      }
    } else {
      sendResponseError(400, `you are not authorized`, res)
    }
  } catch (err) {
    console.log('Error ', err)
    sendResponseError(400, `Error ${err}`, res)
  }
}

const verifySuperAdmin = async (req, res, next) => {
  const {authorization} = req.headers
  if (!authorization) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  } else if (!authorization.startsWith('Bearer ')) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  }
  
  try {
    const payload = await verifyToken(authorization.split(' ')[1])

    if (payload) {
      const user = await User.findById(payload.id, {password: 0})

      if (user.role === 'superAdmin') {
        req['user'] = user
        next()
      } else {
        sendResponseError(400, `you are not authorized`, res)
      }
    } else {
      sendResponseError(400, `you are not authorized`, res)
    }
  } catch (err) {
    console.log('Error ', err)
    sendResponseError(400, `Error ${err}`, res)
  }
}

const verifyRecoverPassword = async (req, res, next) => {
  const {authorization} = req.headers
  if (!authorization) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  } else if (!authorization.startsWith('Bearer ')) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  }

  try {
    const payload = await verifyToken(authorization.split(' ')[1])

    if (payload) {
      const user = await User.findById(payload.id, {password: 0})
      if(user.password === payload.user.password) {
      req['user'] = user
      next()
      }
      else {
        sendResponseError(400, `token is not valid`, res)
      }
    } else {
      sendResponseError(400, `you are not authorized`, res)
    }
  } catch (err) {
    console.log('Error ', err)
    sendResponseError(400, `Error ${err}`, res)
  }
}



module.exports = {
  sendResponseError,
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
  verifyRecoverPassword
}
