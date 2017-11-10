const express = require('express');
require('./services/passport');

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
