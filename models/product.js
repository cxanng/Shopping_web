const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
    validate: [
      function (input) {
        return input.length <= 50;
      }
    ]
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: "Price is required",
    validate: input => {
      return input > 0;
    },
    description:
      "price of one product in Euros, without the Euro sign (€). Euros and cents are in the same float, with cents coming after the decimal point"
  },
  image: {
    type: String,
    description:
      "Adding product images to the Web store API and pages is a Level 2 development grader substitute"
  }
});

productSchema.set("toJSON", { virtual: false, versionKey: false });

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
