'use strict';

const passport                  = require('passport');
const router                    = require('express').Router();
const {check, validationResult} = require('express-validator/check');
const db                        = require('../modules/database');
const connection = db.connect();

//auth register
router.post('/register', [
    check('username', 'Username field must have at least 4 characters').isLength({min: 4, max: 15}),
    check('firstname', 'Firstname field must have at least 4 characters').isLength({min: 4, max: 15}),
    check('lastname', 'Lastname field must have at least 4 characters').isLength({min: 4, max: 15}),
    check('email', 'Invalid email address').isEmail().isLength({ min: 5, max:50 }),
    check('password', 'Password must have at least 8 characters and include one lowercase character, one uppercase character, a number, and a special character')
    .isLength({min: 8, max: 100})
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .custom((value,{req, loc, path}) => {
        if (value !== req.body.re_enter_password) {
            // throw error if passwords do not match
            throw new Error("Passwords does not match");
        } else {
            return value;
        }
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render('login', {
            title: 'Register Errors',
            errors: errors
        })
    } else{
        const data = [req.body.lastname, req.body.firstname, req.body.email, req.body.username, req.body.password];
        db.insertUser(req, res, data, connection);
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
