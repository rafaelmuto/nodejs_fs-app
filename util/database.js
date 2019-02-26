// importing mysql module:
const mysql = require('mysql2');

// creating a query pool to deal with multyple queries:
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_fs',
    password: ''
});

// exporting this pool as promises:
module.exports = pool.promise();