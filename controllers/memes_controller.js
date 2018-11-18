module.exports = (app) => {
    const mysql = require('mysql2');
    require('dotenv').config();
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE
    });

    //Render the main page
    app.get('/main_page', (req, res) => {
        res.render('main_page');
    });

    //Test your database here
    app.get('/database', (req, res) => {
        connection.query(
            'SELECT * FROM `meme`' , (err, results, fields) => {
                console.log(err);
                if (err) res.send('DB failed...Sorry!');
                res.send(results);
            });
    });

    connection.connect((err) => {
        if(err){
            throw err;
        }else {console.log('My sql connected');}
    });









};