const passport = require('passport');
const GoogleStrtegy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user,done) =>{
   done(null, user.id); 
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
       done(null, user); 
    });
});

passport.use(new GoogleStrtegy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback', //configuration function
    proxy: true
}, 
    async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({googleId: profile.id})
            if (existingUser) {
            return done(null, existingUser);
            } const user = await new User({googleId: profile.id}).save();
                      done(null, user);
                
            }
        )
);
