'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Search, Grid, List, Loader2 } from 'lucide-react';
import { useAddBookToLibrary } from '@/hooks/useApi';
import { useInfiniteBooks } from '@/hooks/useInfiniteBooks';
import { useGenres } from '@/hooks/useGenres';
import { BookCard } from '@/components/books/BookCard';
import { BookModal } from '@/components/books/BookModal';
import { useAuth } from '@/components/providers/AuthProvider';

type ViewMode = 'grid' | 'list';

export default function BooksPageClient() {
  const searchParams = useSearchParams();
  const genreFromUrl = searchParams.get('genre');

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const { user } = useAuth();

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (genreFromUrl) {
      setSelectedGenre(genreFromUrl);
    }
  }, [genreFromUrl]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteBooks({
    search: searchTerm || undefined,
    genre: selectedGenre !== 'All' ? selectedGenre : undefined,
    limit: 20,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const addToLibraryMutation = useAddBookToLibrary();

  const { data: genresData } = useGenres();
  const genres = useMemo(() => {
    if (!genresData) return ['All'];
    return ['All', ...genresData.map(g => g.name)];
  }, [genresData]);

  const handleAddToLibrary = async (bookId: string) => {
    if (!user) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      await addToLibraryMutation.mutateAsync({ bookId, status: 'wishlist' });
    } catch (error) {
      console.error('Failed to add book to library:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load books. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Books</h1>
          <p className="text-xl text-muted-foreground">
            Explore our vast collection of books across all genres
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        )}

        {data && data.pages[0]?.books.length > 0 && (
          <>
            <BookModal
              bookId={selectedBookId}
              isOpen={selectedBookId !== null}
              onClose={() => setSelectedBookId(null)}
            />
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.pages.map((page, i) =>
                  page.books.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={setSelectedBookId}
                      onAddToLibrary={handleAddToLibrary}
                      isAddingToLibrary={addToLibraryMutation.isLoading}
                      showAddButton
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {data.pages.map((page, i) =>
                  page.books.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={setSelectedBookId}
                      onAddToLibrary={handleAddToLibrary}
                      isAddingToLibrary={addToLibraryMutation.isLoading}
                      showAddButton
                      className="flex gap-4 p-4 hover:bg-accent/50 transition-colors"
                    />
                  ))
                )}
              </div>
            )}
            
            <div ref={ref} className="flex justify-center items-center p-4">
              {isFetchingNextPage && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading more...</span>
                </>
              )}
            </div>
          </>
        )}

        {data && data.pages[0]?.books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No books found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}
