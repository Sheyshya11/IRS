const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemNumber: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    ssid: {
      type: String,
      required: true,
      unique: true,
    },
    supplier: {
      type: String,
      default: "Vairav Technology",
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    quantity: {
      type: Number,
    },

    quality: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    adminIds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
