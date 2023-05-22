const Categorie = require("../models/Categorie");
const User = require("../models/User");
const Product = require("../models/Product");

const getCategoriesByStore = async (req, res) => {
  try {
    const categories = await Categorie.find({ storeId: req.params.store });
    console.log("categories get");
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getCategorieById = async (req, res) => {
    
  try {
    const categories = await Categorie.findById(req.params.id);
    
    if (!categories) {
      return res.status(404).json({ message: "Categorie not found" });
    }

    console.log("categorie get");
    return res.status(200).json(categories);
    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateCategorie = async (req, res) => {
    try{
        const category = await Categorie.findById(req.params.id);
        const user = req.user;
        if(user.storeId == category.storeId){
            const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, {new: true});
            console.log("categorie update");
            return res.status(200).json(categorie);
        }
        else{
            res.status(403).json({message: "Forbidden"});
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
};

const deleteCategorie = async (req, res) => {
  //if product use this category, dont delete
  try {
    const user = req.user;
    const products = await Product.find({ storeId: user.storeId });
   
    let inUse = false;

    products.forEach(product => {
      if (product.categorieId == req.params.id) {
  
        inUse = true;
      }
    });

    if (inUse) {
      console.log("category in use");
      return res.status(403).json({ message: "Category in use" });
    
    }
    
    const category = await Categorie.findById(req.params.id);
 
    if (user.storeId.toString() == category.storeId.toString()) {
      const categorie = await Categorie.findByIdAndDelete(req.params.id);
      console.log("categorie delete");
      const categories = await Categorie.find({ storeId: user.storeId });
      return res.status(200).json(categories);
    }else{
      console.log("not atorized to delete");
        return res.status(403).json({message: "not allowed"});
    }
    
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
};

const createCategorie = async (req, res) => {
  try {

    //create new category
    storeId = req.user.storeId;
    const categorie = await Categorie.create({
        name: req.body.name,
        storeId: storeId
    });
    console.log("categorie create");
    const categories = await Categorie.find({ storeId: storeId });
    return res.status(201).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getCategoriesByStore,
  updateCategorie,
  deleteCategorie,
  getCategorieById,
  createCategorie,
};
