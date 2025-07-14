import { Book, Author, Genre, UserBook } from '@mybooklist/shared';
import { supabase } from './supabase';

export class BookService {
  async getAllBooks(options: {
    page?: number;
    limit?: number;
    genre?: string;
    search?: string;
    featured?: boolean;
  } = {}) {
    const { page = 1, limit = 20, genre, search, featured } = options;
    
    let query = supabase
      .from('books')
      .select(`
        *,
        book_genres!inner(
          genres(*)
        )
      `);

    // Filter by genre
    if (genre && genre !== 'all') {
      query = query.eq('book_genres.genres.name', genre);
    }

    // Filter by search term
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Filter by featured
    if (featured) {
      query = query.eq('is_featured', true);
    }

    // Add pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);

    // Order by rating
    query = query.order('rating', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }

    // Transform data to match frontend interface
    const books = data?.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverUrl: book.cover_url,
      rating: book.rating,
      totalRatings: book.total_ratings,
      genre: book.book_genres?.map((bg: any) => bg.genres.name) || [],
      publishedYear: book.published_year,
      pages: book.pages,
      isbn: book.isbn,
      language: book.language,
      publisher: book.publisher,
      isFeatured: book.is_featured
    })) || [];

    return {
      books,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async getBookById(id: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_genres!inner(
          genres(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Book not found
      }
      throw new Error(`Failed to fetch book: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      author: data.author,
      description: data.description,
      coverUrl: data.cover_url,
      rating: data.rating,
      totalRatings: data.total_ratings,
      genre: data.book_genres?.map((bg: any) => bg.genres.name) || [],
      publishedYear: data.published_year,
      pages: data.pages,
      isbn: data.isbn,
      language: data.language,
      publisher: data.publisher,
      isFeatured: data.is_featured
    };
  }

  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .insert([{
        title: book.title,
        author: book.author,
        description: book.description,
        cover_url: book.coverUrl,
        rating: book.rating,
        total_ratings: book.totalRatings,
        published_year: book.publishedYear,
        pages: book.pages,
        isbn: book.isbn,
        language: book.language,
        publisher: book.publisher,
        is_featured: book.isFeatured || false
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create book: ${error.message}`);
    }

    // Handle genres separately
    if (book.genre && book.genre.length > 0) {
      await this.updateBookGenres(data.id, book.genre);
    }

    return this.getBookById(data.id) as Promise<Book>;
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .update({
        title: updates.title,
        author: updates.author,
        description: updates.description,
        cover_url: updates.coverUrl,
        rating: updates.rating,
        total_ratings: updates.totalRatings,
        published_year: updates.publishedYear,
        pages: updates.pages,
        isbn: updates.isbn,
        language: updates.language,
        publisher: updates.publisher,
        is_featured: updates.isFeatured
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update book: ${error.message}`);
    }

    if (updates.genre) {
      await this.updateBookGenres(id, updates.genre);
    }

    return this.getBookById(id);
  }

  async deleteBook(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete book: ${error.message}`);
    }

    return true;
  }

  private async updateBookGenres(bookId: string, genres: string[]): Promise<void> {
    // First, remove existing genres
    await supabase
      .from('book_genres')
      .delete()
      .eq('book_id', bookId);

    // Get or create genre IDs
    const genreIds = await Promise.all(
      genres.map(async (genreName) => {
        const { data, error } = await supabase
          .from('genres')
          .select('id')
          .eq('name', genreName)
          .single();

        if (error || !data) {
          // Create new genre if it doesn't exist
          const { data: newGenre, error: createError } = await supabase
            .from('genres')
            .insert([{ name: genreName, color: '#6366f1', description: genreName }])
            .select('id')
            .single();

          if (createError) {
            throw new Error(`Failed to create genre: ${createError.message}`);
          }
          return newGenre.id;
        }

        return data.id;
      })
    );

    // Insert new book-genre relationships
    const bookGenres = genreIds.map(genreId => ({
      book_id: bookId,
      genre_id: genreId
    }));

    const { error } = await supabase
      .from('book_genres')
      .insert(bookGenres);

    if (error) {
      throw new Error(`Failed to update book genres: ${error.message}`);
    }
  }

  async getAllGenres(): Promise<Genre[]> {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch genres: ${error.message}`);
    }

    return data || [];
  }
}

export const bookService = new BookService();
