const express = require("express");
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrderByUser,
    updateOrder,
    deleteOrder,
    getOrdersByStore
} = require("../controller/orderController");
const {verifyUser, verifyAdmin} = require('../middleware/middleware')
router.get("/",verifyUser, getOrders);
router.get("/admin",verifyAdmin, getOrdersByStore);
router.get("/:id",verifyUser, getOrderById);
router.post("/",verifyUser, createOrderByUser);
router.put("/:id",verifyAdmin, updateOrder);
router.delete("/:id",verifyAdmin, deleteOrder);

module.exports = router;