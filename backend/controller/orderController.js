const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const {sendOrderMail} = require('../utils/sendMail');

const getOrders = async (req, res) => {
    try {

        const orders = await Order.find({ 
            userId: req.user._id,
            storeId: req.user.storeId
        })
        console.log("order get")
        if (orders.length > 0) {
            return res.json(orders);
        }else{
            return res.status(404).json({ 
                message: "No orders found",
                orders: []
            });
        }
       
     
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        console.log("order get")
        return res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const getOrdersByStore = async (req, res) => {
    try {
        const storeId = req.user.storeId;
        //populate user and product
        const orders = await Order.find({ storeId: storeId })
        console.log("order get")
        return res.json(orders);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}



const createOrderByUser = async (req, res) => {

    try {
        const { fullName, address, zipCode, city, country, state, products, phone } = req.body
        console.log("products", products);
        const user = await User.findById(req.user._id)
        //orderLength by store
        let orderLength = await Order.find({ storeId: user.storeId }).countDocuments();


            console.log("trigger-2")
            products.forEach(async (product) => {
                const productToUpdate = await Product.findById(product.productId);
                productToUpdate.countInStock = productToUpdate.countInStock - product.count;
                if (productToUpdate.countInStock < 0) {
                    return res.status(400).json({ message: "Producto sin stock" });
                }

                await productToUpdate.save();
            })

            // update user 
            user.fullName = fullName;
            user.address = address;
            user.zipCode = zipCode;
            user.city = city;
            user.country = country;
            user.state = state;
            user.phone = phone;
            await user.save();
            console.log("user update");
            const order = await Order.create({
                userId: user._id,
                storeId: user.storeId,
                products: products.map(product => ({
                    productId: product.productId,
                    count: product.count,
                    price: product.price,
                    name: product.name,
                    option: product.option
                })),
                total: req.body.total,
                tokenUsed: req.body.tokenUsed,
                wallet: req.body.wallet,
                orderType: req.body.orderType,
                txHash: req.body.txHash,
                payed: req.body.payed,
                orderNumber: orderLength + 1,
                delivery: `${user.country}, ${user.state}, ${user.city}, ${user.address}, ${user.zipCode}`,
                orderEmail: user.email,
                ownerName: user.fullName,
                ownerPhone: user.phone
            });
            console.log("order create");

            await sendOrderMail(user.storeId, user, order, products);

            const orders = await Order.find({ userId: req.user._id })
            return res.json(orders);
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al guardar orden" });
    }
}


const updateOrder = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id
    const userRole = req.user.role
    const storeId = req.user.storeId;
    console.log("body", req.body)
    try {
        if (userId === Order.userId || userRole === "admin" || userRole === "superAdmin") {
            const order = await Order.updateOne({ _id: orderId }, req.body);
            console.log("order update");
            const orders = await Order.find({ storeId: storeId })
 
            const orderFind = await Order.findById(orderId);
            console.log("orderNumber", orders)

            return res.json(orders);
        }
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}



const deleteOrder = async (req, res) => {

    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        console.log("order delete");
        return res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { getOrders, getOrderById, createOrderByUser, updateOrder, deleteOrder, getOrdersByStore };