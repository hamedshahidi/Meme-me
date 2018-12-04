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
        'SELECT meme.id_meme, meme.meme_name, meme.meme_medium, meme.tag, SUM(voted_for.liked) as NumLikes, SUM(voted_for.disliked) as NumDislikes\n' +
        'FROM meme, voted_for\n' +
        'WHERE meme.id_meme = voted_for.id_meme\n' +
        'GROUP BY voted_for.id_meme;',
        // 'SELECT * FROM meme',
        (err, results, fields) => {
            if (err) console.log(err);
            console.log('All memes selected');
            res.json(results);
        },
    );
};

const countUploads = (user_id, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT COUNT(id_meme) as NumOfMemes FROM uploaded WHERE uploaded.id_user = ${user_id} GROUP BY id_user;`,
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

const selectProfile = (user_id, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT user.last_name, user.first_name, user.username\n' +
            'FROM user\n' +
            `WHERE user.id_user = ${user_id}\n`,
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

const selectUser = (data, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM user WHERE user.username = ? AND user.password = ?',
            data,
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

const selectUsername = (data, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM user WHERE username = ?',
            data,
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

const selectEmail = (data, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM user WHERE user.email = ?',
            data,
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

const insertUploaded = (data, connection, callback) => {
    connection.execute(
        `INSERT INTO uploaded
        VALUES (
        (SELECT meme.id_meme
        FROM meme
        WHERE meme.meme_medium = '${data[0]}' ),
        ${data[1]}
        );`,
        (err, results, fields) => {
            if (err) console.log(err);
            callback();
        },
    );
};

const insertVoted = (data, connection, callback) => {
    connection.execute(
        `INSERT INTO voted_for (id_user, id_meme, liked, disliked) 
        SELECT ${data[0]},id_meme,${data[1]},${data[2]}
        FROM meme 
        WHERE meme.meme_medium = \'${data[3]}\';`,
        data,
        (err, results, fields) => {
            if (err) console.log(err);
            callback();
        },
    );
};

const updateVoted = (data, connection, callback) => {
    connection.execute(
        `UPDATE voted_for 
        SET 
            liked = ${data[1]},
            disliked = ${data[2]}
        WHERE
            id_user = ${data[0]} AND id_meme = (SELECT id_meme FROM meme WHERE meme.meme_medium = \'${data[3]}\') ;`,
        data,
        (err, results, fields) => {
            if (err) console.log(err);
            callback();
        },
    );
};

const insertGoogleUser = (data, connection) => {
    connection.execute(
        'INSERT INTO user (id_google, last_name, first_name, email, username) VALUE (?, ?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            if (err) console.log('My google error' + err);
        },
    );
};

const insertUser = (data, connection) => {
    return new Promise((resolve, reject) => {
        connection.execute(
            'INSERT INTO user (last_name, first_name, email, username, password) VALUES (?, ?, ?, ?, ?);',
            data,
            (err, results, fields) => {
                if (err) reject(err);
                resolve('Insert user is done');
            },
        );
    });

};
module.exports = {
    connect: connect,
    countUploads: countUploads,
    selectMeme: selectMeme,
    selectProfile: selectProfile,
    selectUser: selectUser,
    selectUsername: selectUsername,
    selectEmail: selectEmail,
    selectGoogleUser: selectGoogleUser,
    insertMeme: insertMeme,
    insertVoted: insertVoted,
    insertUploaded: insertUploaded,
    updateVoted: updateVoted,
    insertGoogleUser: insertGoogleUser,
    insertUser: insertUser,
};