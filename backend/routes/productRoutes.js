const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productControllers");
const {verifyAdmin} = require("../middleware/middleware");

router.get("/:storeId", getProducts);
router.get("/:id", getProductById);
router.get("/:storeId/:category", getProductsByCategory);
router.post("/", verifyAdmin, createProduct);
router.put("/:id", verifyAdmin, updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);


module.exports = router;
