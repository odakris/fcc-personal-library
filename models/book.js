const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  comments: {
    type: Array
  }
});

module.exports = mongoose.model('book', bookSchema);