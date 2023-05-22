const express = require('express')
const {
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
} = require('../controller/user.controller')
const {verifyUser, verifySuperAdmin, verifyAdmin} = require('../middleware/middleware')
const router = express.Router()

router.post('/signup', signUpUser)
router.post('/signin', signInUser)
router.get('/user', verifyUser, getUser)
router.put('/user', verifyAdmin, updateUser)
router.post('/user',verifyAdmin, createUser)
router.post('/firstuser', createFirstUser)
router.get('/users', verifyAdmin, getUsersByStore)
router.put('/user/role', verifySuperAdmin, asignedRole)
router.post('/adminlogin', adminLogin)

router.post('/verify/email/code',verifyUser, verifyEmail);
router.post('/verify/email/code/new',verifyUser, newEmailCode);

router.post('/reset/password/:storeId', requestChangePassword);
router.post('/reset/password/new/:storeId', resetPassword);



module.exports = router
