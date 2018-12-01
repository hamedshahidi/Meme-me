'use strict';

const passport = require('passport');
const router = require('express').Router();
const {check, validationResult} = require('express-validator/check');
const db = require('../modules/database');
const connection = db.connect();

//auth register, input validation
router.post('/register', [
    check('username', 'Username field must have at least 4 characters').
        isLength({min: 4, max: 25}),
    check('firstname', 'Firstname field must have at least 4 characters').
        isLength({min: 4, max: 25}),
    check('lastname', 'Lastname field must have at least 4 characters').
        isLength({min: 4, max: 25}),
    check('email', 'Invalid email address').
        isEmail().
        isLength({min: 5, max: 50}),
    check('password',
        'Password must have at least 8 characters and include one lowercase character, one uppercase character, a number, and a special character').
        isLength({min: 8, max: 100}).
        matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
            'i').
        custom((value, {req, loc, path}) => {
            if (value !== req.body.re_enter_password) {
                // throw error if passwords do not match
                throw new Error('Passwords does not match');
            } else {
                return value;
            }
        }),
    check('username').custom(value => {
        return db.selectUsername(value, connection).then(user => {
            if (user[0]) {
                console.log(user);
                return Promise.reject('Username already in use');
            }
        });
    }),
    check('email').custom(value => {
        return db.selectEmail(value, connection).then(user => {
            if (user[0]) {
                return Promise.reject('Email already in use');
            }
        });
    }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render('login', {
            title: 'Register Errors',
            errors: errors,
        });
    } else {
        const data = [
            req.body.lastname,
            req.body.firstname,
            req.body.email,
            req.body.username,
            req.body.password];
        db.insertUser(data, connection).then((info) => {
            console.log(info);
            return db.selectUsername(data[3], connection);
        }).then((user) => {
                req.login(user[0], function(err) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect(`/profile`);
                });
            },
        );
    }
});

//auth login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));

//auth logout
router.get('/logout', (req, res) => {
    //Handle with passport
    res.send('Logging out');
});

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'],
}));

//callback route for google redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send(req.user);
});

module.exports = router;
