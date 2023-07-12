const mongoose = require("mongoose");

const requestItemSchema = new mongoose.Schema(
  {
    Status: { type: Boolean},
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    RequiredUnit: {
      type: Number,
      default: 1,
    },
    DeliveryDate: { type: Date, required: true },
    Purpose: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestItem", requestItemSchema);
