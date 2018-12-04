'use strict';
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const db = require('./modules/database');
const rs = require('./modules/resize');
const authRoutes = require('./modules/auth-routes');
const passportSetup = require('./config/passport-setup');
const bodyParser = require('body-parser');
//const cookieSession = require('cookie-session');
const passport = require('passport');
//const keys = require('./config/keys');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
};
const sessionStore = new MySQLStore(options);

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(session({
    secret: 'keyboard LOL cat',
    resave: true,
    store: sessionStore,
    saveUninitialized: true,
    // cookie: {secure: true},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/auth', authRoutes);

// app.use(cookieSession({
//     maxAge: 24*3600*1000,
//     keys: [keys.session.cookieKey]
// }));

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
});

//insert to uploaded table
app.use('/upload', (req, res, next) => {
    const data = [req.file.filename + '_medium', req.user];
    //console.log(data);
    db.insertUploaded(data, connection, next);
});

//insert to voted_for table
app.use('/upload', (req, res, next) => {
    const data = [req.user, 0, 0, req.file.filename + '_medium'];
    //console.log(data);
    db.insertVoted(data, connection, next);
    res.send('Insert meme successful, upload finished here ');
});

//update voted_for table when there is interaction from user
app.post('/voted', (req, res, next) => {
    console.log('voted route is called');
    const data = [
        req.user,
        req.body.like,
        req.body.dislike,
        req.body.meme_medium];
    console.log(data);
    db.updateVoted(data, connection, next);
    res.send('Update voted is done');
});

//query all memes from database
app.use('/listMeme', (req, res, next) => {
    db.selectMeme(res, connection, next);
});

app.get('/profile', authenticationMiddleware(), (req, res) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
    db.selectProfile(req.user, connection).then((profile) => {
        return profile[0]
    }).then((userProfile) => {
        db.countUploads(req.user, connection).then((count) => {
            if(count.length === 0 )  userProfile.num = 0;
            else userProfile.num = count[0].NumOfMemes;
            console.log(userProfile);
            res.render('profile' , {profile: userProfile});
        });
    });
});

app.get('/main', authenticationMiddleware(), (req, res) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('upload_page');
});

app.get('/test', authenticationMiddleware(), (req, res) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('test');
});

app.get('/', (req, res) => {
    res.render('login');
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(
            req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    };
}






