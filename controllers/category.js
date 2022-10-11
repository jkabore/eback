const mongoose = require('mongoose');
const Category = require("../models/categorySchema");
/// get products
module.exports.getCategories = async (req, res) => {
  try {
    const categoryList = await Category.find();

    res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//// create products
module.exports.createCategory = async (req, res) => {
  const { name, icon, color } = req.body;
  let category = new Category({
    name: name,
    color: color,
    icon: icon,
  });
  try {
    category = await category.save();
    res.status(200).send(category);
  } catch (error) {
    console.log("category", error);
    return res.status(404).send("category cannot be created");
  }
};

////delete category
module.exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  Category.findByIdAndRemove(id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ message: "Category deleted successfully" });
      } else {
        return res.status(404).json({ message: "category not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ success: false, error });
    });
};

//find category by id

module.exports.findCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return res
      .status(500)
      .json({ message: "category with id the given ID was not found" });
  }
  res.status(200).send(category);
};

////update category
module.exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  if(!mongoose.isValidObjectId(id)){
    return res
    .status(400)
    .send(" Invalid category Id" );
  }
  const { name, icon, color } = req.body;

  const category = await Category.findByIdAndUpdate(id, {
    icon: icon,
    color: color,
    name: name,
  },{
    new: true,
  });
  if (!category) {
    return res
      .status(500)
      .json({ message: "category cannot be updated" });
  }
  res.status(200).send(category);
};
 

  