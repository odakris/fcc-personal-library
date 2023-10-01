"use strict";
const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  addBook,
  getSingleBook,
  addComment,
  deleteBook,
  deleteAll,
} = require("../controllers/bookControllers");

router.route("/api/books").get(getAllBooks).post(addBook).delete(deleteAll);

router
  .route("/api/books/:id")
  .get(getSingleBook)
  .post(addComment)
  .delete(deleteBook);

module.exports = router;
