const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
        storeId:{
            type: mongoose.Types.ObjectId,
            ref: 'store',
            required: true,
        },
        name:{
            type: String,
            required: true
        },

    },
    {
        timestamps: true,
    }
    )

    const Category = mongoose.model("categorie", categorySchema);
    module.exports = Category;