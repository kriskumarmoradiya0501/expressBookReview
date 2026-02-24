const express = require('express');
const public_users = express.Router();
const books = require('./booksdb.js');

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Access the users array from the app (set in index.js)
    const users = req.app.get('users');

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(409).json({ message: "User already exists! Please login." });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Task 2: Get the book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

// Task 3: Get book details based on Author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = {};

    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor[isbn] = books[isbn];
        }
    }

    if (Object.keys(booksByAuthor).length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found for the given author" });
    }
});

// Task 4: Get all books based on Title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = {};

    for (let isbn in books) {
        if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
            booksByTitle[isbn] = books[isbn];
        }
    }

    if (Object.keys(booksByTitle).length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found for the given title" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

module.exports.general = public_users;
