const express = require('express');
const {
    getSubcategoriesByStore,
    getSubcategorieById,
    updateSubcategorie,
    deleteSubcategorie,
    createSubcategorie,
    CreatesubcategorieOptions,
    deleteSubcategorieOptions
} = require('../controller/subcatController');
const { verifyUser, verifySuperAdmin, verifyAdmin } = require('../middleware/middleware');
const router = express.Router()

router.get('/:store', getSubcategoriesByStore);
router.get('/:id', getSubcategorieById);
router.put('/:id', verifyAdmin, updateSubcategorie);
router.delete('/:id', verifyAdmin, deleteSubcategorie);
router.post('/', verifyAdmin, createSubcategorie);
router.post('/:id', verifyAdmin, CreatesubcategorieOptions);
router.delete('/:id/:optionId', verifyAdmin, deleteSubcategorieOptions);

module.exports = router;
