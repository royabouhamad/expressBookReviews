const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      res.send("Customer successfully registered. Now you can log in.");
    } else {
      res.status(400).json({message: "User already exists"});
    }
  } else {
    res.status(400).json({message: "Username and password are required"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });

    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching book list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });

    res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching book details"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        let matchingBooks = [];
        for (const book in books) {
          if (books[book].author === author) {
            matchingBooks.push(books[book]);
          }
        }

        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found by this author"));
        }
      }, 1000);
    });

    res.status(200).send(JSON.stringify({'booksByAuthor': booksByAuthor}, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve, reject) => {
      setTimeout(() => {
        let matchingBooks = [];
        for (const book in books) {
          if (books[book].title === title) {
            matchingBooks.push(books[book]);
          }
        }

        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found by this title"));
        }
      }, 1000);
    });

    res.status(200).send(JSON.stringify({'booksByTitle': booksByTitle}, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books by title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    res.send(JSON.stringify(books[isbn].reviews));
  } else {
    res.status(404).json({message: "Book or reviews not found"});
  }
});

module.exports.general = public_users;
