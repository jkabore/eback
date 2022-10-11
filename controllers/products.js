const mongoose = require("mongoose");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = this.filename.originalname.replace(" ", "-");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

/// create a new Product instance
(module.exports.createProduct = upload.single("image")),
  async (req, res) => {
    const {
      name,
      image,
      countInStock,
      brand,
      price,
      images,
      description,
      richDescription,
      category,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    const fileName = req.fileName;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (!file) return res.status(400).send("No image in the request");
    //// check if category exists
    const categoryCheck = await Category.findById(category);
    if (!categoryCheck) return res.status(400).send("invalid category");

    const product = new Product({
      name: name,
      image: `${basePath}${fileName}`,
      countInStock: countInStock,
      brand: brand,
      price: price,
      rating: rating,
      category: category,
      isFeatured: isFeatured,
      numReviews: numReviews,
      description: description,
      richDescription: richDescription,
      images: images,
    });

    const newProduct = await product.save();

    if (!newProduct) {
      return res.status(500).send("product cannot be created");
    }
    return res.status(200).send(newProduct);
  };
//// get all products
module.exports.getAllProducts = async (req, res) => {
  //getting products by category
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productsList = await Product.find(filter).populate("category");
  if (!productsList) {
    return res.status(500).json({ message: "Products cannot be found" });
  }
  return res.send(productsList);
};

////get product by id
module.exports.findProductById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("category");
  if (!product) {
    return res
      .status(500)
      .json({ message: "Product with id the given ID was not found" });
  }
  return res.status(200).send(product);
};
//////update product
(module.exports.updateProduct = upload.single("image")),
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send(" Invalid product Id");
    }

    const categories = await Category.findById(req.body.category);
    if (!categories) return res.status(400).send("Invalid Category");

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("Invalid Product!");

    const {
      name,
      image,
      countInStock,
      brand,
      price,
      images,
      description,
      richDescription,
      category,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    const file = req.file;
    let imagepath;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name,
        image: imagepath,
        countInStock: countInStock,
        brand: brand,
        price: price,
        rating: rating,
        category: category,
        isFeatured: isFeatured,
        numReviews: numReviews,
        description: description,
        richDescription: richDescription,
        images: images,
      },
      {
        new: true,
      }
    );

    if (!updatedProduct)
      return res.status(500).send("the product cannot be updated!");

    res.send(updatedProduct);
  };

///delete product
module.exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.findByIdAndRemove(id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      } else {
        return res.status(404).send("Product can not be found");
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ success: false, error });
    });
};

//// product count
module.exports.productCount = (req, res) => {
  Product.countDocuments({})
    .then((productCount) => {
      if (!productCount) {
        return res.status(400).json({ success: false });
      } else {
        return res.status(200).send({
          success: true,
          productCount: productCount,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err.message });
    });
};
///// get featured products list

module.exports.getFeaturedProduct = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    return res.status(500).json({ success: false });
  }
  return res.send(products);
};
///// updateProduct gallery

(module.exports.updateGallery = upload.array("images", 10)),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  };
