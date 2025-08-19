const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users[username]) {
    return res.status(409).json({message: "User already exists"});
  }
  users[username] = { password: password };
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let foundBooks = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      foundBooks.push(books[key]);
    }
  }
  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let foundBooks = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      foundBooks.push(books[key]);
    }
  }
  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (books[isbn].reviews && books[isbn].reviews[1]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({message: "No reviews found for this book"});
    }
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
