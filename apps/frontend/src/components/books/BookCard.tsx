import Image from 'next/image';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface BookCardProps {
  book: any;
  onClick?: (bookId: string) => void;
  onAddToLibrary?: (bookId: string) => void;
  isAddingToLibrary?: boolean;
  showAddButton?: boolean;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  onAddToLibrary,
  isAddingToLibrary,
  showAddButton = false,
  className = '',
}) => {
  // Defensive: If book is missing or not an object, don't render
  if (!book || typeof book !== 'object') return null;

  // Defensive: fallback values for book fields
  const {
    id = '',
    title = 'Untitled',
    author = 'Unknown Author',
    coverUrl = '',
    rating,
    totalRatings,
    genre = '',
    publishedYear = '',
  } = book || {};

  // Additional safety checks
  if (!id) return null;
  if (!title && !author) return null;

  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : '-';
  const displayGenre = Array.isArray(genre) ? genre.join(', ') : (genre || 'Unknown');
  const displayYear = publishedYear || '';

  const placeholderImage = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='300'%20height='400'%20viewBox='0%200%20300%20400'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23e0e0e0'%20/%3E%3C/svg%3E";

  return (
    <div
      className={`group cursor-pointer border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-background flex flex-col h-full ${className}`}
      onClick={() => onClick && id && onClick(id)}
      tabIndex={0}
      role="button"
      aria-label={`Open details for ${title}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && id && onClick(id);
        }
      }}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg flex-shrink-0">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title || 'Book cover'}
            width={300}
            height={400}
            className="w-full h-64 object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <img
            src="/placeholder-book.jpg"
            alt={title || 'Book cover'}
            width="300"
            height="400"
            className="w-full h-64 object-cover"
          />
        )}
        {showAddButton && (
          <Button
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={e => {
              e.stopPropagation();
              onAddToLibrary && id && onAddToLibrary(id);
            }}
            disabled={isAddingToLibrary}
            aria-label="Add to Library"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="space-y-2 flex-grow">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{displayRating}</span>
          </div>
          {typeof totalRatings === 'number' && totalRatings > 0 && (
            <span className="text-sm text-muted-foreground">({totalRatings} reviews)</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {displayGenre} {displayYear && `• ${displayYear}`}
        </p>
      </div>
    </div>
  );
};
