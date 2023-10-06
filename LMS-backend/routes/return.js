const express = require("express");
const router = express.Router();
const BorrowedBook = require("../models/borrowedBook");

/**
 * @swagger
 * tags:
 *   name: Return
 *   description: API endpoints for returning books
 */

/**
 * @swagger
 * /return/{borrowedBookId}:
 *   post:
 *     summary: Return a borrowed book by its ID.
 *     tags: [Return]
 *     parameters:
 *       - in: path
 *         name: borrowedBookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the borrowed book to return.
 *     responses:
 *       200:
 *         description: Book returned successfully.
 *       400:
 *         description: Bad request. Invalid borrowed book ID.
 *       404:
 *         description: Borrowed book not found.
 */
router.post("/:borrowedBookId", async (req, res) => {
  const { borrowedBookId } = req.params;

  try {
    const borrowedBook = await BorrowedBook.findById(borrowedBookId);
    if (!borrowedBook) {
      return res.status(404).json({ message: "Borrowed book not found" });
    }

    borrowedBook.returnDate = new Date();
    await borrowedBook.save();

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
