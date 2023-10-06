const express = require("express");
const router = express.Router();
const Book = require("../models/books");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API endpoints for managing books
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         ISBN:
 *           type: string
 *         publishedYear:
 *           type: integer
 *         quantity:
 *           type: integer
 *       example:
 *         title: "Sample Book"
 *         author: "John Doe"
 *         ISBN: "978-1234567890"
 *         publishedYear: 2022
 *         quantity: 5
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get a list of all available books.
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book.
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               publishedYear:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *             example:
 *               title: "Breaking Bad"
 *               author: "Vincent Gilligan"
 *               ISBN: "978-1234567892"
 *               publishedYear: 2014
 *               quantity: 6
 *     responses:
 *       201:
 *         description: Book added successfully.
 *       400:
 *         description: Bad request. Invalid book data.
 */
router.post("/", async (req, res) => {
  const { title, author, ISBN, publishedYear, quantity } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      ISBN,
      publishedYear,
      quantity,
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get details of a specific book by ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved book details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found.
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update details of a specific book by ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               publishedYear:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *             example:
 *               title: "Updated Book"
 *               author: "Jane Doe"
 *               ISBN: "978-0987654321"
 *               publishedYear: 2023
 *               quantity: 10
 *     responses:
 *       200:
 *         description: Book updated successfully.
 *       400:
 *         description: Bad request. Invalid book data.
 *       404:
 *         description: Book not found.
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, ISBN, publishedYear, quantity } = req.body;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title;
    book.author = author;
    book.ISBN = ISBN;
    book.publishedYear = publishedYear;
    book.quantity = quantity;

    await book.save();
    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a specific book by ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete.
 *     responses:
 *       200:
 *         description: Book deleted successfully.
 *       404:
 *         description: Book not found.
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
