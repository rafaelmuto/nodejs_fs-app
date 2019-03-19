const Sequelize = require("sequelize");

const sqlize = require("../util/database");

const orderModel = sqlize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = orderModel;
