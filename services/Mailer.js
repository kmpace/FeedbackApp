const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super(); //super is used to access and call functions on an objects parents

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('no-reply@emaily.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();

  }

formatAddresses(recipients) {
  return recipients.map(({ email }) => { //pulling off the email property of ever recipient
    return new helper.Email(email);  //format the emails with the email helper then return it
  });

}

addClickTracking () { //sendgrid click tracking
  const trackingSettings = new helper.TrackingSettings();
  const clickTracking = new helper.ClickTracking(true, true);

  trackingSettings.setClickTracking(clickTracking);
  this.addTrackingSettings(trackingSettings);

}
addRecipients() {
  const personalize = new helper.Personalization();  //personalize object declared

  this.recipients.forEach(recipient => { //making use for each recpient
    personalize.addTo(recipient);
  });
  this.addPersonalization(personalize); //function defined by mailer based class
}

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request); //sending request to SendGrid, we will recieve a response back
    return response; //returns to response from the send function
  }
}

module.exports = Mailer;
