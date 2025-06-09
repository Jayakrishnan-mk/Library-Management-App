const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../middleware/auth.middleware');

// Get current user's profile
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Profile fetched successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update current user's profile
router.put('/me', authenticate, async (req, res) => {
    try {
        const update = {};
        if (req.body.name !== undefined) update.name = req.body.name;
        if (req.body.email !== undefined) update.email = req.body.email;
        if (req.body.password !== undefined && req.body.password !== "") {
            update.password = await bcrypt.hash(req.body.password, 10);
        }
        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: 'At least one field (name, email, or password) must be provided' });
        }
        const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true, select: '-password' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
