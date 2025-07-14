import { Router } from 'express';
import { userService } from '../services/userService';

const router = Router();

// GET /api/users/profile
router.get('/profile', async (req, res) => {
  try {
    // In a real app, this would get user ID from JWT token
    const userId = 'sample-user-1'; // TODO: Extract from JWT
    
    const user = await userService.getUserProfile(userId);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// GET /api/users/library
router.get('/library', async (req, res) => {
  try {
    const userId = 'sample-user-1'; // TODO: Extract from JWT
    const { status } = req.query;
    
    const userBooks = await userService.getUserLibrary(userId, status as string);
    res.json(userBooks);
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({ error: 'Failed to fetch user library' });
  }
});

// POST /api/users/library
router.post('/library', async (req, res) => {
  try {
    const userId = 'sample-user-1'; // TODO: Extract from JWT
    const { bookId, status = 'wishlist' } = req.body;
    
    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }
    
    const userBook = await userService.addBookToLibrary(userId, bookId, status);
    res.status(201).json(userBook);
  } catch (error) {
    console.error('Error adding book to library:', error);
    res.status(500).json({ error: 'Failed to add book to library' });
  }
});

// PUT /api/users/library/:bookId
router.put('/library/:bookId', async (req, res) => {
  try {
    const userId = 'sample-user-1'; // TODO: Extract from JWT
    const { bookId } = req.params;
    const { status, userRating, progress, notes } = req.body;
    
    const userBook = await userService.updateBookInLibrary(userId, bookId, {
      status,
      userRating,
      progress,
      notes
    });
    
    res.json(userBook);
  } catch (error) {
    console.error('Error updating book in library:', error);
    res.status(500).json({ error: 'Failed to update book in library' });
  }
});

// DELETE /api/users/library/:bookId
router.delete('/library/:bookId', async (req, res) => {
  try {
    const userId = 'sample-user-1'; // TODO: Extract from JWT
    const { bookId } = req.params;
    
    const success = await userService.removeBookFromLibrary(userId, bookId);
    
    if (!success) {
      return res.status(404).json({ error: 'Book not found in library' });
    }
    
    res.json({ message: 'Book removed from library successfully' });
  } catch (error) {
    console.error('Error removing book from library:', error);
    res.status(500).json({ error: 'Failed to remove book from library' });
  }
});

export default router;
