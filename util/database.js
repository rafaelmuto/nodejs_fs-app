// importing mongodb package
const mongodb = require("mongodb");

// initializing a mongodb obj
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://nodeApp:12345@mdbtest-enper.gcp.mongodb.net/test?retryWrites=true"
  )
    .then(client => {
      console.log("mongoDB connected!");
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = mongoConnect;
