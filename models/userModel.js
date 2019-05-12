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

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() == product._id.toString();
  });
  let newQnt = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQnt = this.cart.items[cartProductIndex].qnt + 1;
    updatedCartItems[cartProductIndex].qnt = newQnt;
  } else {
    updatedCartItems.push({
      productId: product._id,
      qnt: newQnt
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function(productCartId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId._id.toString() != productCartId.toString();
  });
  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
