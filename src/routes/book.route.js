const express = require('express');
const router = express.Router();
const BookService = require('../services/book.service');
const { createBookSchema, updateBookSchema } = require('../dtos/book.dto');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// Create a new book (admin only)
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const { error } = createBookSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const book = await BookService.createBook(req.body, req.user.userId);
        res.status(201).json(book);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
});

// Update a book (admin only)
router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const { error } = updateBookSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const book = await BookService.updateBook(req.params.id, req.body);
        res.json(book);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
});

// Get all books (public)
router.get('/', async (req, res) => {
    try {
        const books = await BookService.getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single book by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const book = await BookService.getBookById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a book (admin only)
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const book = await BookService.deleteBook(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
