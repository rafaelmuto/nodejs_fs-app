const Sequelize = require("sequelize");

const sqlize = require("../util/database");

const cartitemModel = sqlize.define("cartitem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = cartitemModel;
