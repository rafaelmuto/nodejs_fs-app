const Sequelize = require('sequelize');

const sqlize = require('../util/database');

const userModel = sqlize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validation: {
            isEmail: true
        }
    }
});

module.exports = userModel;