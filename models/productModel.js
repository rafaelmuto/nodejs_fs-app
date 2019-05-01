const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class productModel {
  constructor(title, price, description, imageURL, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = id ? new mongodb.ObjectID(id) : null;
    this.userId = userId;
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
        console.log(">>>productModel: save()");
        console.log(this._id);
        // console.log(result);
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
        console.log(">>>productModel: fetchAll()");
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
        console.log(">>>productModel: findById()");
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(prodId) })
      .then(result => {
        console.log(">>>productModel: deleteById()");
        console.log(prodId);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
module.exports = productModel;
