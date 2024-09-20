const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const routes = require("./routes/index");
const logger = require('./utils/logger')
const app = express();
const fs = require('fs');
const config = require('./config.json');
const { config: { port } } = config;
const { getUserLanguage } = require('./utils/language');

app.set('views', path.join('/var/www/innoverse', 'views'));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

app.use(session({
    secret: config.secretkey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,  //cookies
        secure: false 
    }
}));

app.use((req, res, next) => {
    const currentLanguage = req.cookies.language || 'en';
    res.locals.language = getUserLanguage({ language: currentLanguage });
    res.locals.currentLanguage = currentLanguage;
    next();
});

logger.info("Creating all web routes.");
for (const route of routes) {
    app.use(route.path, route.route);
}

logger.info('Creating all error routes.');
app.use((err, req, res, next) => {
    if (err.status === 503) {
        res.status(503).render('error/503');
    } else {
        next(err);
    }
});

app.use((req, res) => {
    res.status(404);
    res.render('error/404');
});

app.listen(port, () => {
    logger.log(`The server started on port ${port}`);
});
