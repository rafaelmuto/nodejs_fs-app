// importing mongoose pack:
const mongoose = require("mongoose");

// creating a user schema:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        qnt: { type: Number, require: true }
      }
    ]
  }
});

module.exports = mongoose.model("User", userSchema);
