'use strict';
require('dotenv').config();
const express       = require('express');
const multer        = require('multer');
const db            = require('./modules/database');
const rs            = require('./modules/resize');
const authRoutes    = require('./modules/auth-routes');
const bodyParser    = require('body-parser');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const passport      = require('passport');
const keys          = require('./config/keys');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
// set up auth-route
app.use('/auth', authRoutes);
// set up cookie
app.use(cookieSession({
    maxAge: 24*3600*1000,
    keys: [keys.session.cookieKey]
}));
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000);

const connection = db.connect();
const upload = multer({dest: 'public/memes/'});

//upload the meme
app.post('/upload', upload.single('mediafile'), (req, res, next) => {
    next();
});

//create medium image
app.use('/upload', (req, res, next) => {
    rs.resize(req.file.path, 640,
        'public/medium/' + req.file.filename + '_medium', next);
});

//insert to meme table
app.use('/upload', (req, res, next) => {
    const data = [
        req.file.filename,
        req.file.filename + '_medium',
        req.body.tag.toString()];
    db.insertMeme(data, connection, next);
    res.send('Insert meme successful, upload finished here ');
});

//insert to voted_for table
app.post('/voted', (req, res, next) => {
    console.log('voted route is called');
    const data = [req.body.user, req.body.vote, req.body.meme_medium];
    console.log(data);
    db.insertVoted(data, connection, next);
    res.send('hahaha');
});

//query all memes from database
app.use('/listMeme', (req, res, next) => {
    db.selectMeme(res, connection, next);
});

app.get('/', (req, res) => {
    res.render('login');
});







