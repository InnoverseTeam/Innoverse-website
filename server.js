const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 80;

const secretKey = '';

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const dbConfig = {
    host: "",
    user: "",
    password: "",
    database: ""
};

const conn = mysql.createConnection(dbConfig);

conn.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

app.get('/users/:innoverseid', (req, res) => {
    const { innoverseid } = req.params;
    const userInSession = req.session.innoverseid;

    const query = 'SELECT innoverseid, username FROM users WHERE innoverseid = ?';

    conn.query(query, [innoverseid], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send('Internal Server Error');
        } else if (results.length > 0) {
            res.render('users/user.ejs', { 
                user: results[0], 
                userInSession: userInSession
            });
        } else {
            res.status(404).send('User not found');
        }
    });
});


app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', (req, res) => {
    if (req.body.innoverseid && req.body.username && req.body.password) {
        const { innoverseid, username, password, nnid } = req.body;
        const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const sql = "INSERT INTO users (innoverseid, username, password, nnid, ip_address) VALUES (?, ?, ?, ?, ?)";
        conn.query(sql, [innoverseid, username, password, nnid || null, ip_address], (err, result) => {
            if (err) {
                res.redirect('/setup');
            } else {
                req.session.username = username;
                req.session.innoverseid = innoverseid;
                res.redirect('/');
            }
        });
    } else {
        res.send("Erreur: Tous les champs requis doivent être remplis.");
    }
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/incorrect', (req, res) => {
    res.render('error/incorrect.ejs');
});

app.post('/login', (req, res) => {
    const { innoverseid, password } = req.body;
    if (innoverseid && password) {
        const sql = "SELECT * FROM users WHERE innoverseid = ? AND password = ?";
        conn.query(sql, [innoverseid, password], (err, results) => {
            if (err) {
                res.send("Erreur lors de la connexion à la base de données.");
            } else if (results.length > 0) {
                req.session.username = results[0].username;
                req.session.innoverseid = innoverseid;
                res.redirect('/');
            } else {
                res.redirect('/incorrect');
            }
        });
    } else {
        res.send("Erreur: Tous les champs requis doivent être remplis.");
    }
});

app.get('/', (req, res) => {
    res.render('communities.ejs', { session: req.session });
});

app.get('/communities', (req, res) => {
    res.render('communities.ejs', { session: req.session });
});

app.get('/activity', (req, res) => {
    res.render('activity.ejs', { session: req.session });
});

app.get('/notifications', (req, res) => {
    res.render('notifications.ejs', { session: req.session });
});

app.use((req, res, next) => {
    res.status(404).render('error/404.ejs');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 error code');
});

app.listen(port, () => {
    console.log(`The server started on port ${port}`);
});