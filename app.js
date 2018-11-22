'use strict';
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const db = require('./modules/database');
const rs = require('./modules/resize');
const exif = require('./modules/exif');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.listen(3000);

const connection = db.connect();
const upload = multer({dest: 'public/memes/'});

// upload the meme
app.post('/upload', upload.single('mediafile'), (req, res, next) => {
    next();
});
//insert meme to database
app.use('/upload', (req, res, next) => {
    const data = [req.body.name, req.body.tag];
    db.insertMeme(data, connection, next);
});

app.get('/', (req, res) => {
    res.render('upload_page');
});





