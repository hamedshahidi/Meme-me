/**
 * Create by 'The missing semicolon' team @author
 * Use sharp to resize upload file
 */
'use strict';
const sharp = require('sharp');

// resize file function
const resize = (pathToFile, width, thumbFileName, next) => {
    sharp(pathToFile)
    .resize(width)
    .toFile(thumbFileName).then( data => {
        next();
    });
};

module.exports = {
    resize: resize
};