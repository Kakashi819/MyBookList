'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Book } from '@/lib/api';

interface GenreFilterProps {
  books?: Book[];
  isLoading?: boolean;
}

const defaultGenres = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Technology'
];

export function GenreFilter({ books = [], isLoading = false }: GenreFilterProps) {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = useMemo(() => {
    if (isLoading || books.length === 0) {
      return defaultGenres;
    }

    // Flatten all genre arrays and get unique genres
    const allGenres = books.flatMap(book => book.genre || []);
    const uniqueGenres = ['All', ...new Set(allGenres)];
    return uniqueGenres;
  }, [books, isLoading]);

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Browse by Genre</h2>
        <div className="flex flex-wrap gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-10 w-24 bg-muted rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Browse by Genre</h2>
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre(genre)}
            className={`rounded-full px-6 py-2 transition-all duration-200 ${
              selectedGenre === genre
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-muted/50 border-muted-foreground/30 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
}
