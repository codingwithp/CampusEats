const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,
  items: [
    {
      name: String,
      quantity: Number,
      customization: String,
    },
  ],
  total: Number,
  status: {
    type: String,
    enum: ["new", "preparing", "ready", "completed"],
    default: "new",
  },
  orderTime: String,
  estimatedTime: String,
  specialInstructions: String,
});

module.exports = mongoose.model("Order", orderSchema);
