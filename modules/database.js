'use strict';
const mysql = require('mysql2');

// create the connection to database
const connect = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE
    });
};

const select = (res, connection, callback) => {
    connection.query(
        'SELECT * FROM meme',
        (err, results, fields) => {
            if(err) console.log(err);
            console.log(results);
            callback();
        },
    );
};

const insertMeme = (data, connection, callback) => {
    connection.execute(
        'INSERT INTO meme (name, tag) VALUE (?, ?);',
        data,
        (err, results, fields) => {
            callback();
        },
    );
};

const insertUser = (data, connection, callback) => {
    connection.execute(
        'INSERT INTO user (last_name, first_name, email, username, password) VALUE (?, ?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            callback();
        },
    );
};
module.exports = {
    connect: connect,
    select: select,
    insertMeme: insertMeme,
    insertUser: insertUser
};