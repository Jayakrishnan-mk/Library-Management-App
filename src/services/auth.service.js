const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    static async register({ name, email, password, role }) {
        if (!name || !email || !password || !role) {
            throw { status: 400, message: 'All fields are required' };
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw { status: 400, message: 'User already exists' };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        return { message: 'User registered successfully' };
    }

    static async login({ email, password }) {
        if (!email || !password) {
            throw { status: 400, message: 'All fields are required' };
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw { status: 400, message: 'Invalid credentials' };
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: 400, message: 'Invalid credentials' };
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        };
    }
}

module.exports = AuthService;
