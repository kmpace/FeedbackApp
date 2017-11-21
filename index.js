const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

//calling authRoutes with the app object

require('./routes/authRoutes')(app);

//express route handler
app.get('/', (req, res) => {
  res.send({ bye: 'buddy' });
});

const PORT = process.env.PORT || 5000; //runtime configuration on the port
app.listen(PORT);

// http://localhost:5000/
