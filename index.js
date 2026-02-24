const express = require('express');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const { general } = require('./router/general.js');

const app = express();
const PORT = 5000;

// Track registered users (in-memory)
const users = [];
app.set('users', users);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "bookshop_session_secret_2024",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
// Customer (authenticated) routes: /customer/login, /customer/auth/...
app.use("/customer", authenticated);

// General (public) routes: /, /isbn/:isbn, /author/:author, /title/:title, /review/:isbn, /register
app.use("/", general);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
