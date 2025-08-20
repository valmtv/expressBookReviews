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
  if (isValid(username)) {
    return res.status(409).json({message: "User already exists"});
  }
  // Register the user
  users.push({ username, password }); 
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const bookList = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({message: "Error fetching book list"});
  }
});
// Result is the same so for screenshot i picked code

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject({message: "Book not found"});
      }
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json(error);
  }
});
// Result is the same so for screenshot i picked code
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    const foundBooks = await new Promise((resolve) => {
      let booksByAuthor = [];
      for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[key]);
        }
      }
      resolve(booksByAuthor);
    });
    if (foundBooks.length > 0) {
      return res.status(200).json(foundBooks);
    } else {
      return res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});
// Result is the same so for screenshot i picked code

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    const foundBooks = await new Promise((resolve) => {
      let booksByTitle = [];
      for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      }
      resolve(booksByTitle);
    });
    if (foundBooks.length > 0) {
      return res.status(200).json(foundBooks);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by title"});
  }
});
// Result is the same so for screenshot i picked code

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (books[isbn].reviews && Object.keys(books[isbn].reviews).length > 0) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({message: "No reviews found for this book"});
    }
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
