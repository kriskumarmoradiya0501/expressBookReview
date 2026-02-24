const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// ============================================================
// Task 10: Get all books - Using async callback function
// ============================================================
async function getAllBooks() {
    console.log('\n========== Task 10: Get All Books (Async/Await) ==========');
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log('Status:', response.status);
        console.log('Books List:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching books:', error.message);
    }
}

// ============================================================
// Task 11: Search by ISBN - Using Promises
// ============================================================
function searchByISBN(isbn) {
    console.log(`\n========== Task 11: Search by ISBN (Promises) - ISBN: ${isbn} ==========`);
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/isbn/${isbn}`)
            .then(response => {
                console.log('Status:', response.status);
                console.log('Book Details:');
                console.log(JSON.stringify(response.data, null, 2));
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error fetching book by ISBN:', error.message);
                reject(error);
            });
    });
}

// ============================================================
// Task 12: Search by Author - Using async/await
// ============================================================
async function searchByAuthor(author) {
    console.log(`\n========== Task 12: Search by Author (Async/Await) - Author: "${author}" ==========`);
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        console.log('Status:', response.status);
        console.log('Books by Author:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching books by author:', error.message);
    }
}

// ============================================================
// Task 13: Search by Title - Using async/await
// ============================================================
async function searchByTitle(title) {
    console.log(`\n========== Task 13: Search by Title (Async/Await) - Title: "${title}" ==========`);
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
        console.log('Status:', response.status);
        console.log('Books by Title:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching books by title:', error.message);
    }
}

// ============================================================
// Run all tasks sequentially
// ============================================================
async function runAllTasks() {
    console.log('Starting Node.js Client Tasks (Tasks 10-13)...');
    console.log('Make sure the server is running on http://localhost:5000\n');

    // Task 10
    await getAllBooks();

    // Task 11
    await searchByISBN('1');

    // Task 12
    await searchByAuthor('Jane Austen');

    // Task 13
    await searchByTitle('Pride');

    console.log('\n========== All Tasks Completed ==========');
}

runAllTasks();
