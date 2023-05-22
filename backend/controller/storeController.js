const store = require('../models/Store');

const getStores = async (req, res) => {
    try {
        const stores = await store.find({});
        if(stores.length === 0){
         return res.json({message: "No stores loaded"});
        }
        console.log("stores get");
        return res.status(200).json(stores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const getStoreById = async (req, res) => {
    try {
        const stores = await store.findById(req.params.id);
        console.log("store get");
        return res.status(200).json(stores);
    } catch (error) {
        //id don't exist
        if(error.name === "CastError"){
            return res.status(404).json({ message: "Store not found" });
        }
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const createStore = async (req, res) => {
    try {
        const {name, discount} = req.body;
        const stores = await store.create({
            name,
            discount
        });
        console.log("store create");
        return res.status(201).json(stores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const updateStore = async (req, res) => {
    try{
       
        const Stores = await store.updateOne({_id: req.user.storeId}, req.body);
        console.log("store update");
        const stores = await store.findById(req.user.storeId);
        return res.status(200).json(stores);
    } catch (error) {
        //if category don't exist
        if(error.name === "CastError"){
            return res.status(404).json({ message: "Store not found" });
        }
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const deleteStore = async (req, res) => {
    try{
        const stores = await store.findByIdAndDelete(req.params.id);
        console.log("store delete");
        return res.status(200).json("store deleted");
    } catch (error) {
        //if category don't exist
        if(error.name === "CastError"){
            return res.status(404).json({ message: "Store not found" });
        }
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    getStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore
}
