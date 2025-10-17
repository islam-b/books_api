import express, { Request, Response } from 'express';
import cors from 'cors'; 
import BOOKS from "./books.json"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --------------------
// Book Model
// --------------------
export interface Book {
  id: number;
  title: string;
  isbn: string;
  thumbnailUrl: string;
  authors: string[];
  categories: string[];
  pageCount: number;
  publishedDate: string;
  shortDescription?: string;
  longDescription?: string;
}
 
let books: Book[] = BOOKS

// --------------------
// GET /api/books
// Supports: skipCount, maxResultCount, filter
// --------------------
app.get('/api/books', (req: Request, res: Response) => {
  const skipCount = parseInt(req.query.skipCount as string) || 0;
  const maxResultCount = parseInt(req.query.maxResultCount as string) || 10;
  const filter = (req.query.filter as string)?.toLowerCase() || '';

  let filteredBooks = books;

  if (filter) {
    filteredBooks = books.filter(
      b =>
        b.title.toLowerCase().includes(filter) ||
        b.authors.some(a => a.toLowerCase().includes(filter)) ||
        b.categories.some(c => c.toLowerCase().includes(filter))
    );
  }

  const totalCount = filteredBooks.length;
  const paginatedBooks = filteredBooks.slice(skipCount, skipCount + maxResultCount);

  res.json({
    totalCount,
    items: paginatedBooks
  });
});


app.get('/api/books/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

app.post('/api/books', (req: Request, res: Response) => {
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
app.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required' });

  if(username!="demo") {
    return res.status(403).json({ message: 'Invalid username or password' });
  }

  if(password!="Demo@123") {
    return res.status(403).json({ message: 'Invalid username or password' });
  }

  // (Fake authentication)
  const fakeToken = {
    accessToken: 'fake_access_token_' + Math.random().toString(36).substring(2),
    expiresIn: 3600,
    refresh_token: 'fake_refresh_token_' + Math.random().toString(36).substring(2),
    userInfo: {
      firstName : "Demo",
      lastName : "Demo",
      email: "demo@app.com"
    }
  };

  res.json(fakeToken);
});

// --------------------
// Root endpoint
// --------------------
app.get('/', (_req: Request, res: Response) => {
  res.send('📚 Book API is running!');
});

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
