const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
{
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: true,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    products:[
        {
            name:{
                type: String,
                required: true,
            },
            count:{
                type: String,
                required: true,
            },
            price:{
                type: Number,
                required: true,
            },
            productId:{
                type: String,
                required: true,
            }, 
            option:{
                type: String,
                required: true,
            }
        }
    ],
    payed:{
        type: Boolean,
        required: true,
        default: false,
    },
    tokenUsed:{
        type: String,

    },
    total:{
        type: Number,
        required: true
    },
    wallet:{
        type: String,

    },
    finalStatus:{
        type: String,
        value: ['pending', 'confirmed', 'cancelled'],
        required: true,
        default: 'pending',
    },
    orderNumber:{
        type: Number,
        required: true,
        unique: true
    },
    txHash:{
        type: String,
        unique: true,
    },
    orderType:{
        type: String,
        value: ['entrega', 'custodia'],
    },
    delivery:{
        type: String,
        required: true,
    },
    orderEmail:{
        type: String,
        required: true,
    },
    ownerName:{
        type: String,
    },
    ownerPhone:{
        type: String,
        required: true
    },
},
{
    timestamps: true
}
);

const Order = mongoose.model("order", orderSchema);
module.exports = Order;