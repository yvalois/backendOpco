const express = require("express");
const router = express.Router();
const {
    getCategoriesByStore,
    deleteCategorie,
    getCategorieById,
    createCategorie
} = require("../controller/categoriesController");
const {verifyAdmin} = require("../middleware/middleware");

    router.get("/:store", getCategoriesByStore);
    router.get("/:id", getCategorieById);
    router.post("/",verifyAdmin, createCategorie);
    router.delete("/:id",verifyAdmin, deleteCategorie);


module.exports = router;