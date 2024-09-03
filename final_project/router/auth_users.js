const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  if (users.find(user => user.username === username)) {
    return false;
  }

  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => user.username === username && user.password === password);

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username ||!password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    const accessToken = jwt.sign({ 
      data: password 
    }, "access", { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  } else {
    let reviews = books[isbn].reviews;
    let newReview = req.query.review;
    let username = req.session.authorization['username'];

    if (!newReview) {
      return res.status(400).json({ message: "Review is required" });
    }

    reviews[username] = newReview;
    books[isbn].reviews = reviews;
    res.send(`The review for book with ISBN ${isbn} has been added/update successfully`);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  } else {
    let reviews = books[isbn].reviews;
    let username = req.session.authorization['username'];

    if (!reviews[username]) {
      return res.status(400).json({ message: "Review not found for this user" });
    }

    delete reviews[username];
    books[isbn].reviews = reviews;
    res.send(`The review for book with ISBN ${isbn} posted by user ${username} has been deleted successfully`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
