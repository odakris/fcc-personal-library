const book = require("../models/book");
const ObjectId = require("mongoose").Types.ObjectId;

const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};

const getAllBooks = async (req, res) => {
  try {
    let allBooksRaw = await book.find({});
    let allBooksFormated = allBooksRaw.map((book) => {
      return {
        _id: book._id,
        title: book.title,
        comments: book.comments,
        commentcount: book.comments.length,
      };
    });

    res.json(allBooksFormated);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addBook = async (req, res) => {
  let title = req.body.title;
  if (!title) return res.send("missing required field title");

  try {
    let new_book = await book.create({
      title: title,
    });

    res.json({
      _id: new_book._id,
      title: new_book.title,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getSingleBook = async (req, res) => {
  let book_id = req.params.id;

  if (await !isValidObjectId(book_id)) return res.send("no book exists");

  try {
    let singleBook = await book.findById(book_id);
    if (!singleBook) return res.send("no book exists");

    res.json(singleBook);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addComment = async (req, res) => {
  let book_id = req.params.id;
  let comment = req.body.comment;

  if (await !isValidObjectId(book_id)) return res.send("no book exists");

  try {
    let singleBook = await book.findById(book_id);
    if (!singleBook) return res.send("no book exists");
    if (!comment) return res.send("missing required field comment");

    let addComment = await book.findOneAndUpdate(
      { _id: book_id },
      { $push: { comments: comment } },
      { new: true }
    );

    res.json({
      _id: addComment._id,
      title: addComment.title,
      commentcount: addComment.commentcount,
      comments: addComment.comments,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteBook = async (req, res) => {
  let book_id = req.params.id;

  if (await !isValidObjectId(book_id)) return res.send("no book exists");

  try {
    let singleBook = await book.findById(book_id);
    if (!singleBook) return res.send("no book exists");

    await book.deleteOne({ _id: book_id });

    res.send("delete successful");
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteAll = async (req, res) => {
  try {
    await book.deleteMany({});
    res.send("complete delete successful");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAllBooks,
  addBook,
  getSingleBook,
  addComment,
  deleteBook,
  deleteAll,
};
