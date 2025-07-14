'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, Star, Plus } from 'lucide-react';
import Image from 'next/image';
import { useBooks, useAddBookToLibrary } from '@/hooks/useApi';
import { useAuth } from '@/components/providers/AuthProvider';

type ViewMode = 'grid' | 'list';

export default function BooksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const { user } = useAuth();

  const { data, isLoading, error } = useBooks({
    search: searchTerm || undefined,
    genre: selectedGenre !== 'All' ? selectedGenre : undefined,
    limit: 20,
  });

  const addToLibraryMutation = useAddBookToLibrary();

  const genres = ['All', 'Fiction', 'Romance', 'Dystopian', 'Mystery', 'Fantasy', 'Science Fiction'];

  const handleAddToLibrary = async (bookId: string) => {
    if (!user) {
      // Redirect to sign in
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
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Books</h1>
          <p className="text-xl text-muted-foreground">
            Explore our vast collection of books across all genres
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
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

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        )}

        {/* Results Count */}
        {data && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {data.books.length} of {data.total} book{data.total !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Books Grid/List */}
        {data && data.books.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.books.map(book => (
                  <BookGridCard 
                    key={book.id} 
                    book={book} 
                    onAddToLibrary={handleAddToLibrary}
                    isAddingToLibrary={addToLibraryMutation.isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data.books.map(book => (
                  <BookListCard 
                    key={book.id} 
                    book={book} 
                    onAddToLibrary={handleAddToLibrary}
                    isAddingToLibrary={addToLibraryMutation.isLoading}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {data && data.books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No books found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}

interface BookCardProps {
  book: any;
  onAddToLibrary: (bookId: string) => void;
  isAddingToLibrary: boolean;
}

function BookGridCard({ book, onAddToLibrary, isAddingToLibrary }: BookCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <Image
          src={book.coverUrl || '/placeholder-book.jpg'}
          alt={book.title}
          width={300}
          height={400}
          className="w-full h-80 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Button
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onAddToLibrary(book.id);
          }}
          disabled={isAddingToLibrary}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">({book.totalRatings} reviews)</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {Array.isArray(book.genre) ? book.genre.join(', ') : book.genre} • {book.publishedYear}
        </p>
      </div>
    </div>
  );
}

function BookListCard({ book, onAddToLibrary, isAddingToLibrary }: BookCardProps) {
  return (
    <div className="flex gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex-shrink-0">
        <Image
          src={book.coverUrl || '/placeholder-book.jpg'}
          alt={book.title}
          width={120}
          height={160}
          className="w-20 h-28 object-cover rounded"
        />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-muted-foreground">{book.author}</p>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToLibrary(book.id);
            }}
            disabled={isAddingToLibrary}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{book.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({book.totalRatings} reviews)</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {Array.isArray(book.genre) ? book.genre.join(', ') : book.genre}
          </span>
          <span className="text-sm text-muted-foreground">{book.publishedYear}</span>
        </div>
      </div>
    </div>
  );
}
