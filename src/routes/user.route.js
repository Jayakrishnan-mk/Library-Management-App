const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// Get all users (admin only)
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ message: 'Users fetched successfully', users });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific user's details and transactions (admin only)
router.get('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const transactions = await Transaction.find({ user: req.params.id }).populate('book');
        res.json({ message: 'User details fetched successfully', user, transactions });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
