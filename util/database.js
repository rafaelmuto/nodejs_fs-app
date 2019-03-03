const Sequelize = require('sequelize');

const sqlize = new Sequelize('node_fs', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    // added operatosAliases: false to get rid of the deprecation warning...
    operatorsAliases: false
});

module.exports = sqlize;