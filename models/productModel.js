const getDb = require("../util/database").getDb;

class productModel {
  constructor(title, price, description, imageURL) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
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
}

// sequelize takes the model name (in this case 'product') and uses it as the table name in the plural (in this case 'products'):
// you can prevent this the configuration obj passed as the 3rd argument of define():
// const productModel = sqlize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageURL: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// }, {
// configs go here...
// disable the modification of table names; By default, sequelize will automatically
// transform all passed model names (first parameter of define) into plural.
// if you don't want that, set the following:
// freezeTableName: true,
// define the table's name:
// tableName: 'custom_name'
// });

module.exports = productModel;
