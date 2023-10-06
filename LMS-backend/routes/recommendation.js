const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/books");

/**
 * @swagger
 * /recommendation/{userId}:
 *   get:
 *     summary: Get personalized book recommendations for a user.
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user for whom recommendations are requested.
 *     responses:
 *       200:
 *         description: Successful response with recommended books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book' # Reference to the Book schema
 *       400:
 *         description: Bad request. User not found.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("borrowedBooks"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recommendedBooks = await Book.find({
      $or: [
        { genre: { $in: user.favoriteGenres }, _id: { $nin: user.borrowedBooks.map(b => b.bookId) } },
        { author: { $in: user.favoriteAuthors }, _id: { $nin: user.borrowedBooks.map(b => b.bookId) } },
      ],
    }).limit(10);

    res.json(recommendedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
