const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    image: {
        type: String,
      },
  },
  { timestamps: true }
);

//// transforming _id to id to make it front end friendly
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

categorySchema.set('toJSON', {
  virtuals: true,
});
const Category = mongoose.model("category", categorySchema);
module.exports = Category;
