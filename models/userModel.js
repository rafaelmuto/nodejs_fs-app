const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class userModel {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then(result => {
        console.log(">>>userModel: save()");
        // console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  addToCart(product) {
    // searching for the product in the cart
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() == product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    // if the product already exists in the cart, just update its quantity.
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].qnt + 1;
      updatedCartItems[cartProductIndex].qnt = newQuantity;
      // else push a new entry to the cart array
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectID(product._id),
        qnt: newQuantity
      });
    }
    // commiting the cart item to a new array
    const updatedCart = {
      items: [...updatedCartItems]
    };

    // connecting and updating the database
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then(result => {
        console.log(">>>userModel: addToCart(" + product._id + ")");
        // console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCart() {
    console.log(">>>userModel: getCart()");
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(produtcs => {
        return produtcs.map(p => {
          return {
            ...p,
            qnt: this.cart.items.find(i => {
              return i.productId.toString() == p._id.toString();
            }).qnt
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    // connecting and updating the database
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then(result => {
        console.log(">>>userModel: deleteItemFromCart(" + productId + ")");
        // console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  addOrder() {
    console.log(">>>userModel: addOrder()");
    // try to implement total value of the order...
    const db = getDb();
    // getting cart products info
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.username,
            email: this.email
          }
        };
        return db.collection("orders").insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectID(userId) })
      .then(user => {
        console.log(">>>userModel: findById(" + userId + ")");
        // console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = userModel;
