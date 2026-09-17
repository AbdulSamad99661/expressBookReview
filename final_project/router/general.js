const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new customer
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Unable to register user. Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(404).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
        const getBooksPromise = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };
        const allBooks = await getBooksPromise();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Task 3 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
        }
    });

    getBookByISBN
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((err) => {
            return res.status(err.status || 500).json({ message: err.message });
        });
});

// Task 4 & Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => {
            return new Promise((resolve, reject) => {
                let matchingBooks = [];
                const keys = Object.keys(books);
                for (let key of keys) {
                    if (books[key].author.toLowerCase() === author.toLowerCase()) {
                        matchingBooks.push({ isbn: key, ...books[key] });
                    }
                }
                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject({ status: 404, message: `No books found for author: ${author}` });
                }
            });
        };

        const foundBooks = await getBooksByAuthor();
        return res.status(200).json(foundBooks);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 5 & Task 13: Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = () => {
            return new Promise((resolve, reject) => {
                let matchingBooks = [];
                const keys = Object.keys(books);
                for (let key of keys) {
                    if (books[key].title.toLowerCase() === title.toLowerCase()) {
                        matchingBooks.push({ isbn: key, ...books[key] });
                    }
                }
                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject({ status: 404, message: `No books found with title: ${title}` });
                }
            });
        };

        const foundBooks = await getBooksByTitle();
        return res.status(200).json(foundBooks);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 6: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

/*
 * ==============================================================================
 * Tasks 10-13 Implementation with Axios (Client / Helper functions)
 * ==============================================================================
 */

// Task 10: Get all books using async/await with Axios
const getBooksAsyncAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error fetching all books:", error.message);
        throw error;
    }
};

// Task 11: Search by ISBN using Promises with Axios
const getBookByISBNAxios = (isbn) => {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
            throw error;
        });
};

// Task 12: Search by Author using async/await with Axios
const getBooksByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
        throw error;
    }
};

// Task 13: Search by Title using async/await with Axios
const getBooksByTitleAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by title ${title}:`, error.message);
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getBooksAsyncAxios = getBooksAsyncAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
