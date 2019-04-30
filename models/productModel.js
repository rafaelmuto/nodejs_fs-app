const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class productModel {
  constructor(title, price, description, imageURL, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = new mongodb.ObjectID(id);
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product entry
      dbOp = db
        .collection("products")
        .updateOne({ _id: new mongodb.ObjectID(this._id) }, { $set: this });
    } else {
      // insert new entry to the database
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectID(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
module.exports = productModel;
