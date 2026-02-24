const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();

const JWT_SECRET = "your_jwt_secret_key_2024";

// Middleware to verify JWT token for authenticated routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Also check session
    const sessionToken = req.session && req.session.token;
    const activeToken = token || sessionToken;

    if (!activeToken) {
        return res.status(401).json({ message: "Access denied. No token provided. Please login first." });
    }

    try {
        const decoded = jwt.verify(activeToken, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token. Please login again." });
    }
};

// Task 7: Login as a Registered user
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const users = req.app.get('users');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials. Please check your username and password." });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    // Save token to session
    req.session.token = token;
    req.session.username = username;

    return res.status(200).json({
        message: "User successfully logged in",
        token: token
    });
});

// Task 8: Add or Modify a book review (authenticated users only)
regd_users.put('/auth/review/:isbn', authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.query;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required as a query parameter" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Review for book with ISBN ${isbn} has been added/updated successfully`,
        reviews: books[isbn].reviews
    });
});

// Task 9: Delete book review (authenticated users only, only their own reviews)
regd_users.delete('/auth/review/:isbn', authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user on the given book" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: `Review for book with ISBN ${isbn} by user '${username}' has been deleted successfully`,
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.JWT_SECRET = JWT_SECRET;
