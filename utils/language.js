const languages = require('../translations/index');

function getUserLanguage(account = {}) {
    const { language = 'en' } = account;

    switch (language) {
        case "en":
            return languages.en;
        case "fr":
            return languages.fr;
        case "es":
            return languages.es;
        case "de":
            return languages.de;
        case "ja":
            return languages.ja;
        case "ru":
            return languages.ru;
        case "it":
            return languages.it;
        default:
            return languages.en;
    }
}

module.exports = { getUserLanguage };
