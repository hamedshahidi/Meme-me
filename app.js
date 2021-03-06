/*
 * Create by 'The missing semicolon' team @author
 * Upload js file is for processing file data when upload button is clicked
 */

'use strict';
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const db = require('./modules/database');
const rs = require('./modules/resize');
const https =require('https');
const http = require('http');
const authRoutes = require('./modules/auth-routes');
const passportSetup = require('./config/passport-setup');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sslkey = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');

//Option for https
const httpsOptions = {
    key: sslkey,
    cert: sslcert
};

//Option for sessionStore
const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PWD
};
const sessionStore = new MySQLStore(options);

const app = express();
app.set('trust proxy');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(session({
    secret: 'keyboard LOL cat',
    resave: true,
    store: sessionStore,
    saveUninitialized: true,
    cookie: {secure: true},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/auth', authRoutes);

const connection = db.connect();
const upload = multer({dest: 'public/memes/'});

//check user is authenticated or not
const authenticationMiddleware = () => {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(
            req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    };
};

//upload the meme
app.post('/upload', upload.single('mediafile'), (req, res, next) => {
    console.log(req.body);
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
        req.body.radioBtn.toString(),
        req.body.caption.toString()];
    db.insertMeme(data, connection, next);
});

//insert to uploaded table
app.use('/upload', (req, res, next) => {
    const data = [req.file.filename + '_medium', req.user];
    db.insertUploaded(data, connection, next);
});

//insert to has_tags table
app.use('/upload', (req, res, next) => {
    const data = [
        req.file.filename + '_medium',
        req.body.radioBtn
    ];
    db.insertHasTag(data, connection, next);
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
    db.checkVoted(data, connection).then((result) => {
        if (result.length === 0) {
            db.insertVoted(data, connection, next);
            res.send('Vote is inserted');
        } else {
            db.updateVoted(data, connection, next);
            res.send('Vote is updated');
        }
    });
});

//search
app.post('/search', (req, res, next) => {
    console.log(req.body.search);
    db.searchMeme(req.body.search, res, connection);
});

//query all memes from database
app.use('/listMeme', (req, res, next) => {
    db.selectMeme(res, connection, next);
});

//delete meme from database
app.post('/delete', (req, res, next) => {
    console.log(req.body.meme_medium);
    db.deleteHas_tags(req.body.meme_medium, connection, next).then((result) => {
        db.deleteUploaded(req.body.meme_medium, connection, next).then((result) => {
            db.deleteVoted_for(req.body.meme_medium, connection, next).then((result) => {
                db.deleteMeme(req.body.meme_medium, connection, next).then((result) => {
                    res.send('Removing done');
                })
            })
        })
    });
});

//query profile user
app.get('/profile', authenticationMiddleware(), (req, res) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
    db.selectProfile(req.user, connection).then((profile) => {
        return profile[0];
    }).then((userProfile) => {
        db.countUploads(req.user, connection).then((count) => {
            if (count.length === 0) userProfile.num = 0;
            else userProfile.num = count[0].NumOfMemes;
            db.selectMemeProfile(req.user, connection).then((memes) => {
                    if (memes.length === 0) {
                        userProfile.memes = 0;
                    } else {
                        userProfile.memes = memes.reverse();
                    }
                    res.render('profile', {profile: userProfile});
                },
            );
        });
    });
});

//main page
app.get('/main', authenticationMiddleware(), (req, res) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
    if(req.user === 1){
        res.render('main', {title: 'Admin'});
    }else{
        res.render('main', {title: 'Main page'});
    }
});

//login page
app.get('/', (req, res) => {
    res.render('login');
});

//create http server, listen to port
http.createServer((req,res)=>{
    const redir ='https://' + req.headers.host + '/node' + req.url;
    console.log(redir);
    res.writeHead(302,{'Location': redir});
    res.end();
}).listen(8000);

//create https server, listen to port
https.createServer(httpsOptions,app).listen(3000);






