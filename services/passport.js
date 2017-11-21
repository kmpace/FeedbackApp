const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

//function call creating a new instance of GoogleStrategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    //identifying user information can now be save to the database
    (accessToken, refreshToken, profile, done) => {
      new User({ googleId: profile.id }).save(); //save the user's googleId to Mongo database
    }
  )
);
