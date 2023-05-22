const Subcategorie = require("../models/Subcategorie");
const Product = require('../models/Product');

const getSubcategoriesByStore = async (req, res) => {
    try {
        const subcategories = await Subcategorie.find({ storeId: req.params.store });
        console.log("subcategories get");
        return res.status(200).json(subcategories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const getSubcategorieById = async (req, res) => {
    try {
        const subcategories = await Subcategorie.findById(req.params.id);

        if (!subcategories) {
            return res.status(404).json({ message: "Subcategorie not found" });
        }

        console.log("subcategorie get");
        return res.status(200).json(subcategories);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const updateSubcategorie = async (req, res) => {
    try {
        const subcategorie = await Subcategorie.findById(req.params.id);
        const user = req.user;
        if (user.storeId == subcategorie.storeId) {
            const subcategorie = await Subcategorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
            console.log("subcategorie update");
            const subcategories = await Subcategorie.find({ storeId: user.storeId });
            return res.status(200).json(subcategories);
        }
        else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const deleteSubcategorie = async (req, res) => {
    try {
        const user = req.user;
        const products = await Product.find({ storeId: user.storeId });
        let inUse = false;
        for (let i = 0; i < products.length; i++) {
            if (products[i].subcategoryId == req.params.id) {
                inUse = true;
            }
        }
        if (!inUse) {
            const subcategorie = await Subcategorie.findByIdAndDelete(req.params.id);
            console.log("subcategorie delete");
            const subcategories = await Subcategorie.find({ storeId: user.storeId });
            return res.status(200).json(subcategories);
        }
        else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const createSubcategorie = async (req, res) => {
    try {
        const user = req.user;
      
        const subcategorie = await Subcategorie.create({
            name: req.body.name,
            storeId: user.storeId
        })
        console.log("subcategorie create");
        const subcategories = await Subcategorie.find({ storeId: req.user.storeId });
        return res.status(200).json(subcategories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const CreatesubcategorieOptions = async (req, res) => {
    try {
        const user = req.user;
        console.log("creating subcategorie options");
        const subcategorie = await Subcategorie.findById(req.params.id);
        if (user.storeId.toString() == subcategorie.storeId.toString()){
            const subcategorie = await Subcategorie.findByIdAndUpdate(req.params.id, { $push: { options: req.body } }, { new: true });
            console.log("subcategorie options create");
            const subcategories = await Subcategorie.find({ storeId: user.storeId });
            return res.status(200).json(subcategories);
        }
        else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const deleteSubcategorieOptions = async (req, res) => {
    try {
        const user = req.user;
        const subcategorie = await Subcategorie.findById(req.params.id);
        if (user.storeId.toString() == subcategorie.storeId.toString()){
            const subcategorie = await Subcategorie.findByIdAndUpdate(req.params.id, { $pull: { options: { _id: req.params.optionId } } }, { new: true });
            console.log("subcategorie options delete");
            const subcategories = await Subcategorie.find({ storeId: user.storeId });
            return res.status(200).json(subcategories);
        }
        else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    getSubcategoriesByStore,
    getSubcategorieById,
    updateSubcategorie,
    deleteSubcategorie,
    createSubcategorie,
    CreatesubcategorieOptions,
    deleteSubcategorieOptions
}