const express = require("express");
const router = express.Router();
const Book = require("../models/books");

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API endpoints for searching books
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for books by title, author, or ISBN.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query (title, author, or ISBN).
 *     responses:
 *       200:
 *         description: Successfully retrieved search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request. Invalid search query.
 */
router.get("/", async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      return res.status(400).json({ message: "Invalid search query" });
    }

    const searchResults = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { ISBN: { $regex: query, $options: "i" } },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
