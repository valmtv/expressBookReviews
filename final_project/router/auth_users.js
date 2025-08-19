const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {username: "user1", password: "pass"},
  {username: "val", password: "pass"},
];
            

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(
    user => user.username === username 
    && user.password === password
  );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (!isValid(username)) {
    return res.status(404).json({message: "User not found"});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(403).json({message: "Invalid password"});
  }
    
  let accessToken = jwt.sign(
    {data: username},
    'access',
    {expiresIn: 60 * 60}
  );

  req.session.authorization = {
    accessToken,
  };
  return res.status(200).json({message: "User logged in successfully", accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
