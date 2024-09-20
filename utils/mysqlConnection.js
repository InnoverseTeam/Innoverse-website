const mysql = require('mysql');
const colors = require('colors');
const logger = require ('./logger');
const config = require('../config.json');

const { db } = config;
const { mysqlhost, mysqluser, mysqlpassword, mysqldatabase } = db;

const con = mysql.createConnection({
    host: mysqlhost,
    user: mysqluser,
    password: mysqlpassword,
    database: mysqldatabase
});

con.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    logger.info(`Connected to the database: ${mysqldatabase}`);
});

const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête :', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = { con, query };
