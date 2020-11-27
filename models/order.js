const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OderedItem = new Schema({
  product: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: "Id is required"
    },
    name: {
      type: String,
      required: "Name is required",
      trim: true,
      validate: [
        function (input) {
          return input.length <= 50;
        }
      ]
    },
    price: {
      type: Number,
      required: "Price is required",
      validation: input => {
        return input > 0;
      },
      description:
        "price of one product in Euros, without the Euro sign (€). Euros and cents are in the same float, with cents coming after the decimal point"
    },
    description: {
      type: String,
      trim: true
    }
  },
  quantity: {
    type: Number,
    required: "Quantity is required."
  }
});

const orderSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: {
    type: [OderedItem],
    minlength: 1,
    description:
      "Array of order items. Each item must have a COPY of the product information (no image) and the amount of products ordered"
  }
});

orderSchema.set("toJSON", { virtuals: false, versionKey: false });
const Order = new mongoose.model("Order", orderSchema);
module.exports = Order;
