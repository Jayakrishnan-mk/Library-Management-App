const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

const MAX_BORROW_LIMIT = 3; // lets assume a user can borrow maximum 3 books.

class TransactionService {
    static async borrowBook(userId, bookId) {
        // Check if user has reached borrow limit
        const activeBorrows = await Transaction.countDocuments({ user: userId, status: 'borrowed' });
        if (activeBorrows >= MAX_BORROW_LIMIT) {
            throw { status: 400, message: `Borrow limit of ${MAX_BORROW_LIMIT} reached` };
        }
        // Check if book exists and is available
        const book = await Book.findById(bookId);
        if (!book) throw { status: 404, message: 'Book not found' };
        if (book.availableCopies < 1) throw { status: 400, message: 'No copies available' };
        // Check if user already borrowed this book and hasn't returned it
        const alreadyBorrowed = await Transaction.findOne({ user: userId, book: bookId, status: 'borrowed' });
        if (alreadyBorrowed) throw { status: 400, message: 'You have already borrowed this book' };
        // Create transaction
        const transaction = new Transaction({ user: userId, book: bookId });
        await transaction.save();
        // Update book availableCopies
        book.availableCopies -= 1;
        await book.save();
        return transaction;
    }

    static async returnBook(userId, bookId) {
        // Find active borrow transaction
        const transaction = await Transaction.findOne({ user: userId, book: bookId, status: 'borrowed' });
        if (!transaction) throw { status: 404, message: 'No active borrow found for this book' };
        transaction.status = 'returned';
        transaction.returnedAt = new Date();
        await transaction.save();
        // Update book availableCopies
        const book = await Book.findById(bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }
        return transaction;
    }

    static async getUserTransactions(userId) {
        return Transaction.find({ user: userId }).populate('book');
    }

    static async getAllTransactions() {
        return Transaction.find().populate('user').populate('book');
    }
}

module.exports = TransactionService;
