module.exports = [
    {
        path: "/",
        route: require("./route/index")
    },
    {
        path: "/account",
        route: require('./route/account')
    },
    {
        path: "/users",
        route: require('./route/users')
    }
];
