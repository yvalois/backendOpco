const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Store = require('../models/Store')
const {sendResponseError} = require('../middleware/middleware')
const {checkPassword, newToken, recoverPassword, createRandom4DigitCode, createRandom8DigitCode} = require('../utils/utility.function')
const {sendConfirmEmail, sendResetPassword} = require('../utils/sendMail');

const signUpUser = async (req, res) => {
  const {email, fullName, password, storeId} = req.body;
  try {
    const userExist = await User.findOne({email, storeId})
    if (userExist != null) {
      return res.status(500).json({message: 'User already exist'})
    }
    const hash = await bcrypt.hash(password, 8)
    const verificationCode = createRandom4DigitCode();
    const user = await User.create({...req.body, password: hash, verificationCode})
    let token = newToken(user, storeId)
    console.log('User created')
    
    await sendConfirmEmail(storeId, user, verificationCode)

    return res.status(200).send({status: 'ok', token, user})
    
  } catch (err) {
    console.log('Error : ', err)
    return sendResponseError(500, 'Something wrong please try again', res)
  }
}

const signInUser = async (req, res) => {
  const {password, email, storeId} = req.body;
  try {
    const user = await User.findOne({email, storeId})
    if (!!!user) {
     return sendResponseError(400, 'You have to Sign up first !', res)
    }
    const same = await checkPassword(password, user.password)

    if (same) {
      if(!storeId){
        return sendResponseError(400, 'Store error!', res)
      }
      if(user.storeId == storeId){
      let token = newToken(user, storeId)
      console.log("signed in")
      return res.status(200).send({status: 'ok', token, user})
      }
        return sendResponseError(400, 'You are not authorized to access this store', res)
    }
    return sendResponseError(400, 'InValid password !', res)
  } catch (err) {
    console.log('EROR', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, {password: 0})
    if(user.id == req.user.id){  
      console.log("user get")
     return res.status(200).send(user)
    }
  }
  catch (err) {
    console.log('Error : ', err)
    return sendResponseError(500, `Error ${err}`, res)
  }


}

const updateUser = async (req, res) => {

  try {
    const {_id, role} = req.body;
    console.log('userId', req.body)
    const userToUpdate = await User.find({_id, storeId: req.user.storeId})
    console.log(req.user)
    if(req.user._id.toString() == _id.toString()|| req.user.role === 'admin'){
    const user = await User.findByIdAndUpdate(_id, {...req.body}, {new: true})
    const users = await User.find({storeId: req.user.storeId})
     return res.status(200).send(users)
    }else{
      return sendResponseError(400, 'You are not authorized to update this user', res)
    }
    
  } catch (err) {
    console.log('EROR', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const createUser = async (req, res) => {
  const {email, password, role, storeId} = req.body;
  try {
    const hash = await bcrypt.hash(password, 8)
    const user = await User.create({...req.body, password: hash})
    console.log("user created")
    return res.status(201).send(user)
  } catch (err) {
    console.log('EROR', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const createFirstUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    const hash = await bcrypt.hash(password, 8)
    const userLength = await User.countDocuments()
    if(userLength === 0){
      const store = await Store.create({name: 'Store Admin'})
      const user = await User.create({...req.body, password: hash, role: 'superAdmin', storeId: store._id})
      let token = newToken(user, store._id)
      console.log("user created")
      return res.status(201).send({status: 'ok', token})
    }else{
      return sendResponseError(400, 'Admin exist !', res)
    }
  } catch (err) {
    if(password === undefined){
      return sendResponseError(400, 'Password is required !', res)
    }
    console.log('error', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const getUsersByStore = async (req, res) => {
  try {
    const users = await User.find({storeId: req.user.storeId})
    console.log("user get")
    return res.status(200).send(users)
  } catch (err) {
    console.log('error', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const asignedRole = async (req, res) => {
  try {
    const {_id, role} = req.body;
    const user = await User.findByIdAndUpdate(_id, {role}, {new: true})
    console.log("user update")
    const users = await User.find(req.user.storeId)
    return res.status(200).send(users)
  } catch (err) {
    console.log('error', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}



const newEmailCode = async (req, res) => {
  const user = req.user;
  try {
    const verificationCode = createRandom4DigitCode();
    const userToUpdate = await User.findByIdAndUpdate(user._id, {verificationCode}, {new: true})
    
    await sendConfirmEmail(user.storeId, user, verificationCode)
    console.log("email sent")
    return res.status(200).send({status: 'ok'})
  } catch (err) {
    console.log('error', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}


const verifyEmail = async (req, res) => {
  const {verificationCode} = req.body;
  try {
    console.log('verificationCode', verificationCode)
    const tokenuser = req.user;
 
    const findUser = await User.findOne({_id: tokenuser._id, verificationCode})
    if(findUser){
      const findAndUpdate = await User.findByIdAndUpdate(tokenuser._id, {verificationCode: '', emailVerified: true}, {new: true})
      console.log("user update")
      const user = await User.findById(tokenuser._id)
      return res.status(200).send({
        user,
        status: 'ok'})
    }else{
      return sendResponseError({
        status: 'error',
        message: 'Invalid code'
      })
    }
  } catch (err) {
    console.log('error', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const requestChangePassword = async (req, res) => {
  const {email} = req.body;
  const storeId = req.params.storeId;
  try {
    const user = await User.findOne({email, storeId})
    if(user){
      const verificationCode = createRandom8DigitCode();
      const userToUpdate = await User.findByIdAndUpdate(user._id, {verificationCode}, {new: true})
      await sendResetPassword(user.storeId, user, verificationCode)
      console.log("email sent")
      return res.status(200).send({status: 'ok'})
    }else{
      return sendResponseError({
        status: 'error',
        message: 'Invalid email'
      })
    }
  } catch (err) {
    console.log('error', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const resetPassword = async (req, res) => {
  const {verificationCode, password, email} = req.body;
  const storeId = req.params.storeId;
  console.log('verificationCode', verificationCode)
  console.log('password', password)
  console.log('email', email)
  console.log('storeId', storeId)
  try {
    const user = await User.findOne({email, storeId})
    if(user){
      if(user.verificationCode === verificationCode){
        const hash = await bcrypt.hash(password, 8)
        const userToUpdate = await User.findByIdAndUpdate(user._id, {password: hash, verificationCode: ''}, {new: true})
        console.log("user update")
        return res.status(200).send({
          changedPassword: true
        })
      }else{
        return sendResponseError(500, 'Invalid code', res)
      }
    }else{
      return sendResponseError(500, 'Invalid email', res)
    }
  } catch (err) {
    console.log('error', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}
      



const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email, role: 'superAdmin', storeId: //'62e194cd2e116d00125aadbc'})
    '62f8d03b58568000124bff90'});
    if(!!!user){
      return sendResponseError(400, 'User not found !', res)
    }
    const same = await checkPassword(password, user.password)
    if (same) {
      let token = newToken(user, user.storeId)
      console.log("signed in")
      return res.status(200).send({status: 'success', token, user})
    }
    return sendResponseError(400, {
      status: 'error',
      message: 'InValid password !'
    }, res)
    
  } catch (err) {
    console.log('EROR', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}


module.exports = {
  signUpUser, 
  signInUser, 
  getUser, 
  updateUser, 
  createUser, 
  createFirstUser, 
  getUsersByStore, 
  asignedRole, 
  adminLogin,
  verifyEmail,
  newEmailCode,
  requestChangePassword,
  resetPassword
}
