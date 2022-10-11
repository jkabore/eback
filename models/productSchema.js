const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  image: {
    type: String,

    default: "",
  },
  brand: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,

      default: "",
    },
  ],
  price: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  countInStock: {
    type: Number,
    min: 0,
    max: 255,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "category",
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});


//// transforming _id to id to make it front end friendly
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;
