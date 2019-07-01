# nodejs_webapp

An application for a web store running on node.js + express + mongoDB.
- MCV architecture
- CRUD functionallities for users and products on mongoDB
- full authentication with signup/login encryption, CRSF protection
- basic checkout with payment API
- e-mailing system

1. run `npm install` to install the dependencies
2. write your setup.js file exposing these variables:
   - MONGODB_URI: mongoDB URI
   - SENDGRID_APIKEY: sendGrid API key
   - EXPSESS_SECRET: express-session secret word
   - SERVER_PORT: server listem port
3. run `npm start` to start the application.
