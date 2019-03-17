const Sequelize = require('sequelize');

const sqlize = require('../util/database');

const cartModel = sqlize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = cartModel;