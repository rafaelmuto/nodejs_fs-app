const Sequelize = require("sequelize");

const sqlize = require("../util/database");

const orderitemModel = sqlize.define("orderitem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = orderitemModel;
