const Book = require('../models/Book');

class BookService {
    static async createBook(data, adminId) {
        const book = new Book({
            ...data,
            availableCopies: data.totalCopies,
            createdBy: adminId,
        });
        await book.save();
        return book;
    }

    static async updateBook(bookId, data) {
        const book = await Book.findById(bookId);
        if (!book) throw { status: 404, message: 'Book not found' };
        // If totalCopies is updated, adjust availableCopies accordingly
        if (data.totalCopies !== undefined) {
            const diff = data.totalCopies - book.totalCopies;
            book.availableCopies += diff;
            book.totalCopies = data.totalCopies;
        }
        if (data.title) book.title = data.title;
        if (data.author) book.author = data.author;
        if (data.description !== undefined) book.description = data.description;
        book.updatedAt = new Date();
        await book.save();
        return book;
    }

    static async getAllBooks() {
        return Book.find();
    }

    static async getBookById(bookId) {
        return Book.findById(bookId);
    }

    static async deleteBook(bookId) {
        return Book.findByIdAndDelete(bookId);
    }
}

module.exports = BookService;
