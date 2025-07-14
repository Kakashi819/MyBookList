import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API client with authentication
class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    if (!supabase) {
      return {
        'Content-Type': 'application/json',
      };
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Books API
  async getBooks(params?: {
    search?: string;
    genre?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
  }): Promise<{ books: Book[]; total: number; page: number; limit: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.genre && params.genre !== 'All') searchParams.append('genre', params.genre);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.featured) searchParams.append('featured', 'true');

    const query = searchParams.toString();
    return this.request(`/api/books${query ? `?${query}` : ''}`);
  }

  async getBook(id: string): Promise<Book> {
    return this.request(`/api/books/${id}`);
  }

  // Genres API
  async getGenres(): Promise<Genre[]> {
    return this.request('/api/books/genres');
  }

  // User Library API
  async getUserLibrary(status?: string): Promise<UserBook[]> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    
    const query = searchParams.toString();
    return this.request(`/api/users/library${query ? `?${query}` : ''}`);
  }

  async addBookToLibrary(bookId: string, status: 'reading' | 'completed' | 'wishlist' | 'dropped' = 'wishlist'): Promise<void> {
    return this.request('/api/users/library', {
      method: 'POST',
      body: JSON.stringify({ bookId, status }),
    });
  }

  async updateBookInLibrary(
    bookId: string, 
    data: { 
      status?: 'reading' | 'completed' | 'wishlist' | 'dropped';
      progress?: number;
      userRating?: number;
      notes?: string;
    }
  ): Promise<void> {
    return this.request(`/api/users/library/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeBookFromLibrary(bookId: string): Promise<void> {
    return this.request(`/api/users/library/${bookId}`, {
      method: 'DELETE',
    });
  }

  // User Profile API
  async getUserProfile(): Promise<User> {
    return this.request('/api/users/profile');
  }

  // Comments API
  async getBookComments(bookId: string): Promise<Comment[]> {
    return this.request(`/api/books/${bookId}/comments`);
  }

  async addComment(bookId: string, content: string, rating?: number): Promise<Comment> {
    return this.request(`/api/books/${bookId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, rating }),
    });
  }
}

// Types
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  rating: number;
  totalRatings: number;
  genre: string[];
  publishedYear: number;
  pages: number;
  isbn: string;
  language: string;
  publisher: string;
  isFeatured?: boolean;
}

export interface Genre {
  id: string;
  name: string;
  color: string;
  description: string;
  bookCount?: number;
}

export interface UserBook {
  bookId: string;
  book?: Book;
  status: 'reading' | 'completed' | 'wishlist' | 'dropped';
  userRating?: number;
  progress?: number;
  dateAdded: string;
  dateCompleted?: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  bookId: string;
  userId: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// Export singleton instance
export const apiClient = new ApiClient();
