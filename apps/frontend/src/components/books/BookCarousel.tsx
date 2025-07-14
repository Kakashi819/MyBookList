'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import { Book } from '@/lib/api';

interface BookCarouselProps {
  title: string;
  books?: Book[];
  isLoading?: boolean;
}

export function BookCarousel({ title, books = [], isLoading = false }: BookCarouselProps) {

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex gap-4 pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-none w-48">
              <div className="animate-pulse">
                <div className="w-48 h-72 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex-shrink-0 w-48 group cursor-pointer">
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <Image
          src={book.coverUrl}
          alt={book.title}
          width={192}
          height={288}
          className="w-full h-72 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="space-y-1">
        <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{book.rating}</span>
          <span className="text-xs text-muted-foreground">• {book.genre[0] || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
}
