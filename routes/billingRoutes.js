const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin ,  async (req, res) => {
//logic to create and bill new credit card, create a charge, bill credit card, send a reponse back via stripe API that charge is successful

const charge =  await stripe.charges.create({
    amount: 500,
    currency: 'usd',
    description: '$5 for 5 credits',
    source: req.body.id

  });

  req.user.credits += 5; //add five credits to the user
  const user = await req.user.save(); //adds to the database

  res.send(user); //respond to the request with the updated user
  });


};
