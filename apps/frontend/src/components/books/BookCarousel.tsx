'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Play, Plus } from 'lucide-react';
import Image from 'next/image';
import { Book } from '@/lib/api';
import { useRef, useState } from 'react';
import { BookModal } from './BookModal';

interface BookCarouselProps {
  title: string;
  books?: Book[];
  isLoading?: boolean;
}

export function BookCarousel({ title, books = [], isLoading = false }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const targetScroll = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12 group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => scroll('left')}
            className="bg-background/80 border-muted hover:bg-muted/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => scroll('right')}
            className="bg-background/80 border-muted hover:bg-muted/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex gap-4 pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-none w-64">
              <div className="animate-pulse">
                <div className="w-64 h-36 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex gap-4 pb-4">
            {books.map((book, index) => (
              <BookCard 
                key={book.id} 
                book={book} 
                index={index}
                isHovered={hoveredBook === book.id}
                onHover={() => setHoveredBook(book.id)}
                onLeave={() => setHoveredBook(null)}
                onClick={setSelectedBookId}
              />
            ))}
          </div>
        </div>
      )}
      
      <BookModal
        bookId={selectedBookId}
        isOpen={selectedBookId !== null}
        onClose={() => setSelectedBookId(null)}
      />
    </section>
  );
}

function BookCard({ 
  book, 
  index, 
  isHovered, 
  onHover, 
  onLeave,
  onClick 
}: { 
  book: Book; 
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: (bookId: string) => void;
}) {
  return (
    <div 
      className={`flex-shrink-0 w-64 group cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-105 z-10' : 'scale-100'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => onClick(book.id)}
    >
      <div className="relative mb-3 overflow-hidden rounded-lg bg-card">
        <Image
          src={book.coverUrl}
          alt={book.title}
          width={256}
          height={144}
          className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Action Buttons */}
        <div className={`absolute bottom-2 right-2 flex gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <Button 
            size="sm" 
            className="bg-primary/90 hover:bg-primary text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              onClick(book.id);
            }}
          >
            <Play className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 p-2"
            onClick={(e) => {
              e.stopPropagation();
              // Add to wishlist functionality
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-white">{book.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-muted/50 rounded-full">
            {book.genre?.[0] || 'Unknown'}
          </span>
          <span>•</span>
          <span>{book.publishedYear || 'N/A'}</span>
        </div>
        
        {/* Progress bar for reading status (optional) */}
        {(book as any).userProgress && (
          <div className="w-full bg-muted/50 rounded-full h-1.5 mt-2">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(book as any).userProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
