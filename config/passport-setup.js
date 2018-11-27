'use strict';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const db = require('../modules/database');

const connection = db.connect();

passport.serializeUser((user, done) => {
    done(null, user[0].id_user);
});

passport.deserializeUser(function(id, done) {
    connection.query('select * from users where id = ' + id,
        function(err, rows) {
            done(err, rows[0]);
        });
});

passport.use(new GoogleStrategy({
        //options for the google strategy
        clientID: keys.google.GOOGLE_CLIENT_ID,
        clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect',
    },
    //passport callback function
    (accessToken, refreshToken, profile, done) => {
        // check if the user already exists
        console.log(profile);
        db.selectGoogleUser(profile, connection).then((currentUser) => {
            // already have this user
            if (currentUser.length !== 0) {
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                const data = [
                    profile.id,
                    profile.name.familyName,
                    profile.name.givenName,
                    profile.emails[0].value,
                ];
                console.log('My data is ' + data);
                db.insertGoogleUser(data, connection);
                db.selectGoogleUser(profile, connection).then((newUser) => {
                    console.log(newUser);
                    done(null, newUser);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    },
));
