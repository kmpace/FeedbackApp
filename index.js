const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

require('./models/user');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json()); //any post or put requests, the body will be assigned to the req.body properties of the object

//all express middleware requires app.use statments
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //how long can the cookie set in browser before its is expired, 30 days
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

//calling authRoutes with the app object

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

//configuration of Express for production environment
if(process.env.NODE_ENV === 'production') {
  //Express will serve up production assests like main.js and main.class
  app.use(express.static('client/build'));


  //Express will server up index.html file if it doesn't recognize the route

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build' , 'index.html'));
  });

}

//express route handler
app.get('/', (req, res) => {
  res.send({ bye: 'buddy' });
});

const PORT = process.env.PORT || 5000; //runtime configuration on the port
app.listen(PORT);

// http://localhost:5000/
