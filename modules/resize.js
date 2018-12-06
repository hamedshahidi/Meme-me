'use strict';
const sharp = require('sharp');

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