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
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn]));
  } else {
    res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];

  for (const book in books) {
    if (books[book].author === author) {
      booksByAuthor.push(books[book]);
    }
  }

  res.send(JSON.stringify({'booksByAuthor': booksByAuthor}));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  for (const book in books) {
    if (books[book].title === title) {
      booksByTitle.push(books[book]);
    }
  }

  res.send(JSON.stringify({'booksByTitle': booksByTitle}));
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
