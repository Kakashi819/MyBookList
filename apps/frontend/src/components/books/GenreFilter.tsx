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
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 w-20 bg-muted rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGenre(genre)}
            className="rounded-full"
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
}
