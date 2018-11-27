'use strict';
const passport          = require('passport');
const router            = require('express').Router();

//auth login
router.get('/login', (req, res) => {
   res.render('login');
});

//auth logout
router.get('/logout', (req, res) => {
    //Handle with passport
    res.send('Logging out');
});

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//callback route for google redirect
router.get('/google/redirect',passport.authenticate('google'), (req, res) => {
    res.send(req.user);
});

module.exports = router;
