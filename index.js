require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth.route');
const bookRoutes = require('./src/routes/book.route');
const transactionRoutes = require('./src/routes/transaction.route');
const profileRoutes = require('./src/routes/profile.route');
const userRoutes = require('./src/routes/user.route');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Use the authentication routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/transactions', transactionRoutes);
app.use('/profile', profileRoutes);
app.use('/users', userRoutes);

// Basic route
const defaultRoute = (req, res) => res.send('Library Management App Backend Running');
app.get('/', defaultRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
