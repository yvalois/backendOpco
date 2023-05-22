const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
        },
        discount:{
            type: Number,
            required: true,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
    );

    const Store = mongoose.model("store", storeSchema);
    module.exports = Store;