const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    storeId:{
        type: mongoose.Types.ObjectId,
        ref: 'store',
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    options:[{
        name:{
            type: String,
            required: true,
        }
    }]
})

const Subcategory = mongoose.model('subcategory', subcategorySchema);
module.exports = Subcategory;