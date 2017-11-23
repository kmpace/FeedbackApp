const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id); //using id that is assigned to the user by Mongo
});

passport.deserializeUser((id, done) => {
  //takes the user id in the model and turn it back to a user in our database
  User.findById(id) //mongo query to find user by user id
    .then(user => {
      done(null, user);
    });
});

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
      User.findOne({ googleId: profile.id }).then(existingUser => {
        //initiates query to find a profile id if it already exists
        if (existingUser) {
          //we already have an existing record  with the given profileID
          done(null, existingUser); //two arguments null- everything is oke and existingUser is the value
        } else {
          // we dont have a user record with this ID
          new User({ googleId: profile.id })
            .save() //save the user's googleId to Mongo database, new model instance
            .then(user => done(null, user));
        }
      });
    }
  )
);
