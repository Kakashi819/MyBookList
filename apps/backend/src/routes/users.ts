import { Router } from 'express';
import { userService } from '../services/userService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, favoriteGenres } = req.body;
    const user = await userService.updateUserProfile(req.user.id, {
      name,
      favoriteGenres
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// GET /api/users/library
router.get('/library', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { status } = req.query;
    const userBooks = await userService.getUserLibrary(req.user.id, status as string);
    res.json(userBooks);
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({ error: 'Failed to fetch user library' });
  }
});

// POST /api/users/library
router.post('/library', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { bookId, status = 'wishlist' } = req.body;
    
    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }
    
    const userBook = await userService.addBookToLibrary(req.user.id, bookId, status);
    res.status(201).json(userBook);
  } catch (error) {
    console.error('Error adding book to library:', error);
    res.status(500).json({ error: 'Failed to add book to library' });
  }
});

// PUT /api/users/library/:bookId
router.put('/library/:bookId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { bookId } = req.params;
    const { status, userRating, progress, notes } = req.body;
    
    const userBook = await userService.updateBookInLibrary(req.user.id, bookId, {
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
router.delete('/library/:bookId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { bookId } = req.params;
    
    const success = await userService.removeBookFromLibrary(req.user.id, bookId);
    
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
