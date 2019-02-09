const path = require('path');

// process.mainModule.filename returns the filename of the file that started the node process.
// path.dirname() returns the path to a file

module.exports = path.dirname(process.mainModule.filename);