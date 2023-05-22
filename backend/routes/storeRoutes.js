const express = require('express')
const router = express.Router()
const {
    getStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore
} = require('../controller/storeController')
const {verifySuperAdmin,verifyAdmin } = require('../middleware/middleware')

router.get('/',verifySuperAdmin, getStores)
router.get('/:id', getStoreById)
router.post('/',verifySuperAdmin, createStore)
router.put('/update',verifyAdmin, updateStore)
router.delete('/:id',verifySuperAdmin, deleteStore)

module.exports = router