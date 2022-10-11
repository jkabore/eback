const {Router} = require("express");
const routerCategory = Router();
const category=require("../controllers/category");
routerCategory.post("/category",category.createCategory);
routerCategory.get("/category",category.getCategories);
routerCategory.delete("/category/:id",category.deleteCategory);
routerCategory.get("/category/:id",category.findCategoryById);
routerCategory.put("/category/:id",category.updateCategory);

module.exports=routerCategory; 