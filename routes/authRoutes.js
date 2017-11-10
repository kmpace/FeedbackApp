const passport = require('passport');

//export this function from this file, app is added as an argument to the function
module.exports = app => {
  //kicking user into the OAuth flow of google
  //get HTTP request
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      //options argument with scope passing in, specifices to google that we want user profile and email informaiton
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));
};
