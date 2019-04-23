// importing mongodb package
const mongodb = require("mongodb");

// initializing a mongodb obj
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://nodeApp:12345@mdbtest-enper.gcp.mongodb.net/test?retryWrites=true"
  )
    .then(client => {
      console.log("mongoDB connected!");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
