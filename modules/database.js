'use strict';
const mysql = require('mysql2');

// create the connection to database
const connect = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
    });
};

const selectMeme = (res, connection) => {
    connection.query(
        'SELECT * FROM meme',
        (err, results, fields) => {
            if (err) console.log(err);
            console.log('All memes selected');
            res.json(results);
        },
    );
};

const selectUser = (profile, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM user WHERE ${profile.id} = user.id_google`,
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(results);
            },
        );
    });
};

const selectGoogleUser = (profile, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM user WHERE ${profile.id} = user.id_google`,
            (err, results, fields) => {
                //console.log(results);
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(results);
            },
        );
    });
};

const insertMeme = (data, connection, callback) => {
    connection.execute(
        'INSERT INTO meme (meme_name, meme_medium, tag) VALUES (?, ?, ?);',
        data,
        (err, results, fields) => {
            callback();
        },
    );
};

const insertVoted = (data, connection, callback) => {
    connection.execute(
        `INSERT INTO voted_for (id_user, id_meme, vote) SELECT ${data[0]},id_meme,${data[1]} FROM meme WHERE meme.meme_medium = \'${data[2]}\';`,
        data,
        (err, results, fields) => {
            if (err) console.log(err);
            console.log(fields);
            callback();
        },
    );
};

const insertGoogleUser = (data, connection) => {
    connection.execute(
        'INSERT INTO user (id_google, last_name, first_name, email) VALUE (?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            if(err) console.log(err);
        }
    );
};
module.exports = {
    connect: connect,
    selectMeme: selectMeme,
    selectGoogleUser: selectGoogleUser,
    selectUser: selectUser,
    insertMeme: insertMeme,
    insertVoted: insertVoted,
    insertGoogleUser: insertGoogleUser,
};