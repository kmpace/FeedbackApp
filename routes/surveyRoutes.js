const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer.js');
const SurveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');


module.exports = app => {
  app.post('/api/surveys', requireLogin, requireCredits, (req, res) => { //verifies that the user is logged in
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

  });
};
