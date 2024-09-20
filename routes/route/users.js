const express = require("express");
const router = express.Router();
const moment = require("moment");
const { query } = require('../../utils/mysqlConnection');
const logger = require('../../utils/logger');
const { getUserLanguage } = require('../../utils/language');

router.get('/:inid', async (req, res) => {
    const currentLanguage = req.cookies.language || 'en';
    const translations = getUserLanguage({ language: currentLanguage });
    const inid = req.params.inid;

    try {
        const account = await query('SELECT * FROM accounts WHERE inid = ?', [inid]);

        if (account.length === 0) {
            return res.status(404).render("error.ejs", {
                message: "User not found",
                currentLanguage: currentLanguage
            });
        }

        const mii_name = account[0].mii_name;

        res.render("users/user.ejs", {
            session: req.session,
            translations: translations,
            currentLanguage: currentLanguage,
            inid: inid,
            mii_name: mii_name
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('An error occurred while trying to fetch the user.');
    }
});

module.exports = router;
