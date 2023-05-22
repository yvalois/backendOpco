const { findById } = require('../models/Cart');
const Cart = require('../models/Cart');


const getCartProducts = async (req, res) => {
  try {
    const carts = await Cart.find({userId: req.user._id}).populate('productId')
    console.log("cart get")
    return res.status(200).send({status: 'ok', carts})
  } catch (err) {
    console.log(err)
    return res.status(500).send({status: 'error', err})
  }
}

const addProductInCart = async (req, res) => {
  try {
    const {productId, count, option} = req.body
    console.log(productId, count, option)
    const myCarts = await Cart.find({userId: req.user._id})
    //if product exist in cart error
    let exist = false
    myCarts.forEach(cart => {
      if (cart.productId.toString() == productId.toString()) {
        exist = true
      }});
    if (exist) {
      console.log("product exist in cart")
      return res.status(400).send({status: 'error', message: 'product already exist in cart'})
    }


      const cart = new Cart({
        userId: req.user._id,
        productId,
        count,
        option: option 
      })
      await cart.save()
    
    const carts = await Cart.find({userId: req.user._id}).populate('productId')
    console.log("cart add")
    return res.status(200).send({status: 'ok', carts})
  } catch (err) {
    console.log(err)
    return res.status(500).send({status: 'error', err})
  }
}


const deleteProductInCart = async (req, res) => {
  try {
    const cart = await Cart.deleteOne({_id: req.params.id})
    const carts = await Cart.find({userId: req.user._id}).populate('productId')
    console.log("cart delete", cart)
    return res.status(200).send({status: 'ok', carts})
  } catch (err) {
    console.log(err)
    return res.status(500).send({status: 'error', err})
  }

}

const modifyProductInCart = async (req, res) => {
  const {productId, count} = req.body
  console.log(productId, count)
  try {
    const cartByUser = await Cart.findOne({userId: req.user._id, productId})
    const cart = await Cart.findByIdAndUpdate(cartByUser._id, {count}) 
    console.log("cart modify")
    const carts = await Cart.find({userId: req.user._id}).populate('productId')
    return res.status(200).send({status: 'ok', carts})
  } catch (err) {
    console.log(err)
    return res.status(500).send({status: 'error', err})
  }
}

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.deleteMany({userId: req.user.id})
    console.log("cart clear")
    const carts = await Cart.find({userId: req.user._id}).populate('productId')
    return res.status(200).send({status: 'ok', carts})
  } catch (err) {
    console.log(err)
    return res.status(500).send({status: 'error', err})
  }
}

module.exports = {addProductInCart, deleteProductInCart, getCartProducts, modifyProductInCart, clearCart}
