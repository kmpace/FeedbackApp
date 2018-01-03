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
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    //identifying user information can now be save to the database
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        //we already have an existing record  with the given profileID
        return done(null, existingUser); //two arguments null- everything is oke and existingUser is the value
      }
      // we dont have a user record with this ID
      const user = await new User({ googleId: profile.id }).save(); //save the user's googleId to Mongo database, new model instance
      done(null, user);
    }
  )
);
