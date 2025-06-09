const express = require('express');
const router = express.Router();
const TransactionService = require('../services/transaction.service');
const { borrowBookSchema } = require('../dtos/transaction.dto');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// Borrow a book (user only)
router.post('/borrow', authenticate, authorizeRoles('user'), async (req, res) => {
    try {
        const { error } = borrowBookSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const transaction = await TransactionService.borrowBook(req.user.userId, req.body.bookId);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
});

// Return a book (user only)
router.post('/return', authenticate, authorizeRoles('user'), async (req, res) => {
    try {
        const { error } = borrowBookSchema.validate(req.body); // bookId required
        if (error) return res.status(400).json({ message: error.details[0].message });
        const transaction = await TransactionService.returnBook(req.user.userId, req.body.bookId);
        res.json(transaction);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
});

// Get user's transactions (user only)
router.get('/my', authenticate, authorizeRoles('user'), async (req, res) => {
    try {
        const transactions = await TransactionService.getUserTransactions(req.user.userId);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all transactions (admin only)
router.get('/all', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const transactions = await TransactionService.getAllTransactions();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
