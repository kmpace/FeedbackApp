const express = require('express');
const app = express();

//express route handler
app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

const PORT = process.env.PORT || 5000; //runtime configuration on the port
app.listen(PORT);

// http://localhost:5000/
