const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');

const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');


module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
      const surveys = await Survey.find({
        _user: req.user.id })//find all surverys that have _user property = the current user (req.user.id)
          .select({ recipients: false }); //do no include the list of recipients when we pull this out of the database

        res.send(surveys);
  });



  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');

  });

app.post('/api/surveys/webhooks', (req, res) => {
const p = new Path('/api/surveys/:surveyId/:choice'); // new path object to look at the path name to extract ID and choice

 _.chain(req.body)
   .map(({email, url }) => { //take the clicked url and parsing it to get the route name to detect a click
    const match = p.test(new URL(url).pathname);
    if (match) { // if match is not null, return the match
      return { email, surveyId: match.surveyId, choice: match.choice };
    }
  })
    .compact() //removes undefined obejects
    .uniqBy('email', 'surveyId') //uniquineess check
    .each(({ surveyId, email, choice }) => {
      Survey.updateOne ({
        _id: surveyId,
        recipients: {
          $elemMatch: { email: email, responded: false }
          }
      }, {
        $inc: { [choice]: 1 },
        $set: { 'recipients.$.responded': true },
        lastResponded: new Date()
      }).exec(); //executes the query

    })
    .value(); //returns value

  res.send({});

});

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => { //verifies that the user is logged in
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey ({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })), //splits every email by a comma, .map functions a fucntion on that array and returns in a new array
      _user: req.user.id,
      dateSent: Date.now()
    });

    //Great place to send an email
    const mailer = new Mailer(survey, surveyTemplate(survey)); //first argument being passed is subject/recipents and second argument is content of the email

    try {
    await mailer.send();
    await survey.save();
    req.user.credits -= 1; //deducts one credit from the user after sending survery
    const user = await req.user.save();

    res.send(user);
  } catch (err) {
    res.status(422);

  }


  });
};
