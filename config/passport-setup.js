'use strict';
const passport = require('passport');
const keys = require('./keys');
const db = require('../modules/database');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const connection = db.connect();

passport.serializeUser((user, done) => {
    done(null, user.id_user);
});

passport.deserializeUser((id_user, done) => {
    done(null, id_user);
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        const data = [username, password];
        db.selectUser(data, connection).then((user) => {
            if (user.length === 0) {
                done(null, false);
            }
            else done(null, user[0]);
        }).catch((err) => {
            console.log(err);
        });
    },
));

passport.use(new GoogleStrategy({
        //options for the google strategy
        clientID: keys.google.GOOGLE_CLIENT_ID,
        clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect',
    },
    //passport callback function
    (accessToken, refreshToken, profile, done) => {
        // check if the user already exists
        db.selectGoogleUser(profile, connection).then((currentUser) => {
            // already have this user
            console.log(currentUser);
            if (currentUser.length !== 0) {
                done(null, currentUser[0]);
            } else {
                const data = [
                    profile.id,
                    profile.name.familyName,
                    profile.name.givenName,
                    profile.emails[0].value,
                    profile.emails[0].value
                ];
                console.log('My data is ' + data);
                db.insertGoogleUser(data, connection);
                db.selectGoogleUser(profile, connection).then((newUser) => {
                    done(null, newUser[0]);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    },
));
