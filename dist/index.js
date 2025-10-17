"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const books_json_1 = __importDefault(require("./books.json"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let books = books_json_1.default;
// --------------------
// GET /api/books
// Supports: skipCount, maxResultCount, filter
// --------------------
app.get('/api/books', (req, res) => {
    var _a;
    const skipCount = parseInt(req.query.skipCount) || 0;
    const maxResultCount = parseInt(req.query.maxResultCount) || 10;
    const filter = ((_a = req.query.filter) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
    let filteredBooks = books;
    if (filter) {
        filteredBooks = books.filter(b => b.title.toLowerCase().includes(filter) ||
            b.authors.some(a => a.toLowerCase().includes(filter)) ||
            b.categories.some(c => c.toLowerCase().includes(filter)));
    }
    const totalCount = filteredBooks.length;
    const paginatedBooks = filteredBooks.slice(skipCount, skipCount + maxResultCount);
    res.json({
        totalCount,
        items: paginatedBooks
    });
});
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
});
app.post('/api/books', (req, res) => {
    const book = req.body;
    if (!book || !book.title) {
        return res.status(400).json({ message: 'Invalid book data' });
    }
    // Optionally simulate adding an ID
    book.id = books.length + 1;
    books.push(book);
    res.status(201).json(book);
});
// --------------------
// POST /auth/login
// --------------------
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Username and password are required' });
    // (Fake authentication)
    const fakeToken = {
        access_token: 'fake_access_token_' + Math.random().toString(36).substring(2),
        expires_in: 3600,
        refresh_token: 'fake_refresh_token_' + Math.random().toString(36).substring(2)
    };
    res.json(fakeToken);
});
// --------------------
// Root endpoint
// --------------------
app.get('/', (_req, res) => {
    res.send('📚 Book API is running!');
});
// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
