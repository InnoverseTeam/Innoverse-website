const bcrypt = require('bcrypt');
const moment = require('moment');
const nn_error = require('./nn_error');
const crypto = require('crypto');
const xmlbuilder = require('xmlbuilder');

const utils = {

    nintendoPasswordHash(password, pid) {
        const pidBuffer = Buffer.alloc(4);
        pidBuffer.writeUInt32LE(pid);
    
        const unpacked = Buffer.concat([
            pidBuffer,
            Buffer.from('\x02\x65\x43\x46'),
            Buffer.from(password)
        ]);
        const hashed = crypto.createHash('sha256').update(unpacked).digest().toString('hex');
    
        return hashed;
    } ,   

    fullUrl(req) {
        const protocol = req.protocol;
        const host = req.host;
        const opath = req.originalUrl;
    
        return `${protocol}://${host}${opath}`;
    }
}

module.exports = utils;
