const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const BorrowedBook = require("../models/borrowedBook");

/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: API endpoints for borrowing books
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowedBook:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user who borrowed the book.
 *         bookId:
 *           type: string
 *           description: ID of the borrowed book.
 *         borrowedDate:
 *           type: string
 *           format: date-time
 *           description: Date and time when the book was borrowed.
 *         returnDate:
 *           type: string
 *           format: date-time
 *           description: Date and time when the book was returned (if returned).
 *       required:
 *         - userId
 *         - bookId
 *         - borrowedDate
 */


/**
 * @swagger
 * /borrow/{bookId}:
 *   post:
 *     summary: Borrow a book by its ID.
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to borrow.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: "user_id_here"
 *     responses:
 *       200:
 *         description: Book borrowed successfully.
 *       400:
 *         description: Bad request. Invalid book ID or user already borrowed the maximum number of books.
 *       404:
 *         description: Book not found.
 */
router.post("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const userBorrowedBooksCount = await BorrowedBook.countDocuments({ userId });
    if (userBorrowedBooksCount >= 3) {
      return res.status(400).json({ message: "You have already borrowed the maximum number of books" });
    }

    const borrowedBook = new BorrowedBook({
      userId,
      bookId,
      borrowedDate: new Date(),
    });

    await borrowedBook.save();

    res.json({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
