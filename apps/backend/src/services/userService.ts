import { UserBook } from '@mybooklist/shared';
import { supabase } from './supabase';

export class UserService {
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar_url,
      joinDate: data.created_at,
      totalBooks: data.total_books || 0,
      booksRead: data.books_read || 0,
      currentlyReading: data.currently_reading || 0,
      favoriteGenres: data.favorite_genres || []
    };
  }

  async updateUserProfile(userId: string, updates: {
    name?: string;
    favoriteGenres?: string[];
  }) {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.favoriteGenres !== undefined) updateData.favorite_genres = updates.favoriteGenres;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar_url,
      joinDate: data.created_at,
      totalBooks: data.total_books || 0,
      booksRead: data.books_read || 0,
      currentlyReading: data.currently_reading || 0,
      favoriteGenres: data.favorite_genres || []
    };
  }

  async getUserLibrary(userId: string, status?: string) {
    let query = supabase
      .from('user_books')
      .select(`
        *,
        books (
          id,
          title,
          author,
          description,
          cover_url,
          rating,
          total_ratings,
          published_year,
          pages,
          isbn,
          language,
          publisher,
          is_featured,
          book_genres!inner(
            genres(*)
          )
        )
      `)
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('date_added', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user library: ${error.message}`);
    }

    return data?.map(item => ({
      bookId: item.book_id,
      book: {
        id: item.books.id,
        title: item.books.title,
        author: item.books.author,
        description: item.books.description,
        coverUrl: item.books.cover_url,
        rating: item.books.rating,
        totalRatings: item.books.total_ratings,
        genre: item.books.book_genres?.map((bg: any) => bg.genres.name) || [],
        publishedYear: item.books.published_year,
        pages: item.books.pages,
        isbn: item.books.isbn,
        language: item.books.language,
        publisher: item.books.publisher,
        isFeatured: item.books.is_featured
      },
      status: item.status,
      userRating: item.user_rating,
      progress: item.progress,
      dateAdded: item.date_added,
      dateCompleted: item.date_completed,
      notes: item.notes
    })) || [];
  }

  async addBookToLibrary(userId: string, bookId: string, status: string = 'wishlist') {
    // First check if the book is already in the user's library
    const { data: existingBook } = await supabase
      .from('user_books')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single();

    if (existingBook) {
      // Book already exists, update the status instead
      return await this.updateBookInLibrary(userId, bookId, { status });
    }

    // Add new book to library
    const { data, error } = await supabase
      .from('user_books')
      .insert([{
        user_id: userId,
        book_id: bookId,
        status,
        progress: 0,
        date_added: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add book to library: ${error.message}`);
    }

    return data;
  }

  async updateBookInLibrary(
    userId: string, 
    bookId: string, 
    updates: {
      status?: string;
      userRating?: number;
      progress?: number;
      notes?: string;
    }
  ) {
    const updateData: any = {};
    
    if (updates.status) updateData.status = updates.status;
    if (updates.userRating !== undefined) updateData.user_rating = updates.userRating;
    if (updates.progress !== undefined) updateData.progress = updates.progress;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    // If completing a book, set date_completed
    if (updates.status === 'completed' && updates.progress === 100) {
      updateData.date_completed = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('user_books')
      .update(updateData)
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update book in library: ${error.message}`);
    }

    return data;
  }

  async removeBookFromLibrary(userId: string, bookId: string) {
    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) {
      throw new Error(`Failed to remove book from library: ${error.message}`);
    }

    return true;
  }
}

export const userService = new UserService();
