const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(isValid(username)){
      return res.status(400).json({message: "User already exists"});
    }else{
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
  }else{
    return res.status(404).json({message: "User not registered"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  Promise.resolve(books)
    .then((bookList) => {
      return res.status(200).json(bookList);
    })
    .catch((error) => {
      return res.status(500).json({message: "Error retrieving books", error: error.message});
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  Promise.resolve(books[isbn])
    .then((book) => {
      if(book){
        return res.status(200).json(book);
      }else{
        return res.status(404).json({message: "Book not found"});
      }
    })
    .catch((error) => {
      return res.status(500).json({message: "Error retrieving book", error: error.message});
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  Promise.resolve(Object.values(books).filter(book => book.author === author))
    .then((booksByAuthor) => {
      if(booksByAuthor.length > 0){
        return res.status(200).json(booksByAuthor);
      }else{
        return res.status(404).json({message: "No books found by this author"});
      }
    })
    .catch((error) => {
      return res.status(500).json({message: "Error retrieving books by author", error: error.message});
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  Promise.resolve(Object.values(books).filter(book => book.title === title))
    .then((booksByTitle) => {
      if(booksByTitle.length > 0){
        return res.status(200).json(booksByTitle);
      }else{
        return res.status(404).json({message: "No books found with this title"});
      }
    })
    .catch((error) => {
      return res.status(500).json({message: "Error retrieving books by title", error: error.message});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  Promise.resolve(books[isbn])
    .then((book) => {
      if(book){
        return res.status(200).json(book.reviews);
      }else{
        return res.status(404).json({message: "Book not found"});
      }
    })
    .catch((error) => {
      return res.status(500).json({message: "Error retrieving book reviews", error: error.message});
    });
});

module.exports.general = public_users;
