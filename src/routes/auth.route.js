const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../dtos/auth.dto');

// Register
router.post('/register', async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const result = await AuthService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const result = await AuthService.login(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
