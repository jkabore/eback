const { Router } = require("express");
const productRoute = Router();
const product = require("../controllers/products");
productRoute.post("/product", product.createProduct);
productRoute.get("/product", product.getAllProducts);
productRoute.get("/product/:id", product.findProductById);
productRoute.put("/product/:id", product.updateProduct);
productRoute.delete("/product/:id", product.deleteProduct);
productRoute.get("/product/get/count", product.productCount);
productRoute.get("/product/get/featured/:count", product.getFeaturedProduct);


module.exports = productRoute;
