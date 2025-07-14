import { Router } from 'express';
import { bookService } from '../services/bookService';

const router = Router();

// GET /api/books
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, search, featured } = req.query;
    
    const result = await bookService.getAllBooks({
      page: Number(page),
      limit: Number(limit),
      genre: genre as string,
      search: search as string,
      featured: featured === 'true'
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /api/books (Admin only)
router.post('/', async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// PUT /api/books/:id (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookService.updateBook(id, req.body);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE /api/books/:id (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await bookService.deleteBook(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// GET /api/books/genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await bookService.getAllGenres();
    res.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

export default router;
