import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient, Book, Genre, UserBook, Comment } from '@/lib/api';

// Books
export function useBooks(params?: {
  search?: string;
  genre?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery(
    ['books', params],
    () => apiClient.getBooks(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,
    }
  );
}

export function useBook(id: string) {
  return useQuery(
    ['book', id],
    () => apiClient.getBook(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

// Genres
export function useGenres() {
  return useQuery(
    ['genres'],
    () => apiClient.getGenres(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
}

// User Library
export function useUserLibrary() {
  return useQuery(
    ['userLibrary'],
    () => apiClient.getUserLibrary(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}

export function useAddBookToLibrary() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ bookId, status }: { bookId: string; status: 'reading' | 'completed' | 'wishlist' | 'dropped' }) =>
      apiClient.addBookToLibrary(bookId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userLibrary']);
      },
    }
  );
}

export function useUpdateBookStatus() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ 
      bookId, 
      data 
    }: { 
      bookId: string; 
      data: { 
        status?: 'reading' | 'completed' | 'wishlist' | 'dropped';
        progress?: number;
        rating?: number;
      }
    }) => apiClient.updateBookInLibrary(bookId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userLibrary']);
      },
    }
  );
}

export function useRemoveBookFromLibrary() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (bookId: string) => apiClient.removeBookFromLibrary(bookId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userLibrary']);
      },
    }
  );
}

// User Profile
export function useUserProfile() {
  return useQuery(
    ['userProfile'],
    () => apiClient.getUserProfile(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: { name?: string; favoriteGenres?: string[] }) => apiClient.updateUserProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile']);
      },
    }
  );
}

// Comments
export function useBookComments(bookId: string) {
  return useQuery(
    ['bookComments', bookId],
    () => apiClient.getBookComments(bookId),
    {
      enabled: !!bookId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

export function useAddComment() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ bookId, content, rating }: { bookId: string; content: string; rating?: number }) =>
      apiClient.addComment(bookId, content, rating),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['bookComments', variables.bookId]);
      },
    }
  );
}
