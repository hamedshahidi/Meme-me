/**
 * Create by 'The missing semicolon' team @author
 * Database queries are exported from this file
 */
'use strict';
const mysql = require('mysql2');

// create the connection to database
const connect = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PWD,
    });
};

// select meme from database for main page
const selectMeme = (res, connection) => {
    connection.query(
        'SELECT meme.id_meme, meme.meme_name, meme.meme_medium, meme.tag, meme.caption, SUM(IFNULL(voted_for.liked, 0)) as NumLikes, SUM(IFNULL(voted_for.disliked, 0)) as NumDislikes\n' +
        'FROM meme LEFT JOIN voted_for \n' +
        'ON meme.id_meme = voted_for.id_meme\n' +
        'GROUP BY meme.id_meme\n' +
        'ORDER BY meme.id_meme;',
        (err, results, fields) => {
            if (err) console.log(err);
            console.log('All memes selected');
            res.json(results);
        },
    );
};

// search meme based on tag
const searchMeme = (tag, res, connection) => {
    connection.query(
        'SELECT meme.id_meme, meme.meme_name, meme.meme_medium, meme.tag, meme.caption, SUM(IFNULL(voted_for.liked, 0)) as NumLikes, SUM(IFNULL(voted_for.disliked, 0)) as NumDislikes\n' +
        'FROM meme LEFT JOIN voted_for\n' +
        'ON meme.id_meme = voted_for.id_meme\n' +
        `WHERE meme.tag = '${tag}'\n` +
        'GROUP BY meme.id_meme\n' +
        'ORDER BY meme.id_meme;',
        (err, results, fields) => {
            if (err) console.log(err);
            console.log('All memes selected');
            res.json(results);
        },
    );
};

// count number of uploads for each user
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

// select meme in database to show in profile page
const selectMemeProfile = (user_id, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT IFNULL(new.id_user, ${user_id}) , new.id_meme, new.meme_medium, SUM(IFNULL(new.liked, 0)) as NumLikes, SUM(IFNULL(new.disliked, 0)) as NumDislikes\n` +
            'FROM (SELECT meme.id_meme, meme.meme_medium, meme.tag, voted_for.id_user, voted_for.liked, voted_for.disliked\n' +
            '      FROM meme LEFT JOIN voted_for \n' +
            '      ON meme.id_meme = voted_for.id_meme) as new, uploaded\n' +
            `WHERE uploaded.id_user = ${user_id} AND new.id_meme = uploaded.id_meme AND  uploaded.id_meme = new.id_meme\n` +
            'GROUP BY new.id_meme;',
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

// select user profile in database for profile page
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

// select usr from database
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

// select username, check if already exist
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


// select email, check if already exist
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


// select google user, check if already exist
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


// insert meme to database
const insertMeme = (data, connection, callback) => {
    connection.execute(
        'INSERT INTO meme (meme_name, meme_medium, tag, caption) VALUES (?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            callback();
        },
    );
};

// delete data in has_tags table
const deleteHas_tags = (data, connection, callback) => {
    return new Promise((resolve, reject) => {
        connection.execute(
            `DELETE FROM has_tags
            WHERE has_tags.id_meme = (SELECT meme.id_meme FROM meme
            WHERE meme.meme_medium = '${data}');`,
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

// delete data in uploaded table
const deleteUploaded = (data, connection, callback) => {
    return new Promise((resolve, reject) => {
        connection.execute(
            `DELETE FROM uploaded
                WHERE uploaded.id_meme = (SELECT meme.id_meme FROM meme
                WHERE meme.meme_medium = '${data}');`,
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

// delete data in voted_for table
const deleteVoted_for = (data, connection, callback) => {
    return new Promise((resolve, reject) => {
        connection.execute(
            `DELETE FROM voted_for
                    WHERE voted_for.id_meme = (SELECT meme.id_meme FROM meme
                    WHERE meme.meme_medium = '${data}');`,
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

// delete data in meme table
const deleteMeme = (data, connection, callback) => {
    return new Promise((resolve, reject) => {
        connection.execute(
            `DELETE FROM meme
             WHERE meme.meme_medium = '${data}';`,
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

// insert data into uploaded table
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

// check if meme is already voted by user
const checkVoted = (data, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM voted_for WHERE id_user = ${data[0]} AND id_meme = (SELECT id_meme FROM meme WHERE meme.meme_medium = \'${data[3]}\');`,
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

// insert tag into has_tag table
const insertHasTag = (data, connection, callback) => {
    connection.execute(
        `INSERT INTO has_tags
        VALUES (
        (SELECT meme.id_meme
        FROM meme
        WHERE meme.meme_medium = '${data[0]}' ),
        (SELECT tag.id_tag
        FROM tag
        WHERE tag.tag_name = '${data[1]}' ));`,
        (err, results, fields) => {
            if (err) console.log(err);
            callback();
        },
    );
};

// insert vote into voted table
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


// update vote to voted table
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


// insert google user
const insertGoogleUser = (data, connection) => {
    connection.execute(
        'INSERT INTO user (id_google, last_name, first_name, email, username) VALUE (?, ?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            if (err) console.log('My google error' + err);
        },
    );
};

// insert normal user
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
    searchMeme: searchMeme,
    selectMemeProfile: selectMemeProfile,
    selectProfile: selectProfile,
    selectUser: selectUser,
    selectUsername: selectUsername,
    selectEmail: selectEmail,
    selectGoogleUser: selectGoogleUser,
    insertMeme: insertMeme,
    deleteMeme: deleteMeme,
    deleteVoted_for: deleteVoted_for,
    deleteUploaded: deleteUploaded,
    deleteHas_tags: deleteHas_tags,
    checkVoted: checkVoted,
    insertVoted: insertVoted,
    insertUploaded: insertUploaded,
    updateVoted: updateVoted,
    insertHasTag: insertHasTag,
    insertGoogleUser: insertGoogleUser,
    insertUser: insertUser,
};