const express = require('express')
const {
  addProductInCart,
  deleteProductInCart,
  getCartProducts,
  modifyProductInCart,
  clearCart,
} = require('../controller/cart.controller')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.get('/', verifyUser, getCartProducts)
router.post('/add', verifyUser, addProductInCart)
router.post('/delete/:id', verifyUser, deleteProductInCart)
router.post('/modify', verifyUser, modifyProductInCart)
router.post('/clear', verifyUser, clearCart)



module.exports = router
