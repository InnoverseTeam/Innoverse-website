const express = require('express');
const router = express.Router();
const moment = require('moment');
const { query } = require('../../utils/mysqlConnection');
const logger = require('../../utils/logger');
const { getUserLanguage } = require('../../utils/language');

router.get('/login', async (req, res) => {
    res.render(`account/login.ejs`);
});

router.post('/login', async (req, res) => {
    const { inid, password } = req.body;

    if (!inid || !password) {
        return logger.warn('Someone tried to connect but couldnt lol');
        res.redirect('/account/login');
    }

    const results = await query('SELECT * FROM accounts WHERE inid = ?', [inid]);

    if (results.length === 0) {
        return logger.warn('Someone tried to connect but couldnt lol');
        res.redirect('/account/login');
    }

    const user = results[0];

    if (password !== user.password) {
        return logger.warn('Someone tried to connect but couldnt lol');
        res.redirect('/account/login');
    }

    req.session.inid = user.inid;

    logger.log(`${inid} just logged in to Innoverse!`);
    res.redirect('/');
});

router.get('/signup', (req, res) => {
    res.render('account/signup.ejs');
});

router.post('/signup', async (req, res) => {
    const { email, password, confirm_password, inid } = req.body;
  
    if (!inid || !email || !password || !confirm_password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
  
    const existingUserByEmail = await query('SELECT * FROM accounts WHERE email = ?', [email]);

    if (existingUserByEmail.length > 0) {
        return res.status(400).json({ error: 'Email already used.' });
    }

    const existingUserByInid = await query('SELECT * FROM accounts WHERE inid = ?', [inid]);

    if (existingUserByInid.length > 0) {
        return res.status(400).json({ error: 'Innoverse ID already used.' });
    }

    await query('INSERT INTO accounts (email, password, inid) VALUES (?, ?, ?)', [email, password, inid]);
  
    const newUser = await query('SELECT * FROM accounts WHERE email = ?', [email]);

    req.session.user = {
        inid: newUser[0].inid,
        email: newUser[0].email
    };
  
    logger.info(`${inid} was created an Innoverse account !`);
    res.redirect('/');
});

module.exports = router;
