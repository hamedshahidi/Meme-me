'use strict';
const passport          = require('passport');
const GoogleStrategy    = require('passport-google-oauth20').Strategy;
const keys              = require('./keys');
const db                = require('../modules/database');

const connection = db.connect();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // //Find the user according to the id (Thong qua promise?)
    // Promise.then((user) => {
    //     done(null, user);
    // });
});

passport.use(new GoogleStrategy({
        //options for the google strategy
        clientID: keys.google.GOOGLE_CLIENT_ID,
        clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
    },
    //passport callback function
    (accessToken, refreshToken, profile, done) => {
        // check if the user already exists
        new Promise((resolve, reject) =>{
            resolve(db.selectUser(profile, connection));
        }).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                const data = [
                    profile.id,
                    profile.user.familyName,
                    profile.user.givenName
                ];
                db.insertGoogleUser(data, );
                // if not, create user in our db
                console.log('User have to be created')
            }
        });
    }
));