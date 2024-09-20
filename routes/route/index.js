const express = require("express");
const router = express.Router();
const moment = require("moment");
const { query } = require('../../utils/mysqlConnection');
const logger = require('../../utils/logger');
const { getUserLanguage } = require('../../utils/language');

router.get('/', (req, res) => {
    const currentLanguage = req.cookies.language || 'en'; 
    const translations = getUserLanguage({ language: currentLanguage });
    const inid = req.session.inid;

    res.render('communities.ejs', {
        session: req.session,
        translations: translations,
        currentLanguage: currentLanguage,
        inid: inid
    });
});

module.exports = router;
