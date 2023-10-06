const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", 
    required: true,
  },
  borrowedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null, 
  }
});

const BorrowedBook = mongoose.model("BorrowedBook", borrowedBookSchema);

module.exports = BorrowedBook;
