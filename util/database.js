const Sequelize = require("sequelize");

// initializing sequelize; calling a new instance with new Sequelize( db name, user, password, {settings}):
const sqlize = new Sequelize("node_fs", "root", "", {
  dialect: "mysql",
  host: "localhost",
  // added operatosAliases: false to get rid of the deprecation warning...
  operatorsAliases: false,
  // disable loggin:
  logging: false
});

module.exports = sqlize;
