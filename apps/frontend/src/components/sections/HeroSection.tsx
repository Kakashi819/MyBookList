'use client';

import { Button } from '@/components/ui/button';
import { Play, Info, Star, BookOpen } from 'lucide-react';
import { useBooks } from '@/hooks/useApi';
import Image from 'next/image';

export function HeroSection() {
  const { data: booksData } = useBooks();
  const books = booksData?.books || [];
  const featuredBook = books.find(book => book.rating && book.rating >= 4.5) || books[0];

  if (!featuredBook) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded-lg mb-4 mx-auto w-96"></div>
            <div className="h-6 bg-muted rounded-lg mb-8 mx-auto w-64"></div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 bg-muted rounded-lg w-32"></div>
              <div className="h-12 bg-muted rounded-lg w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featuredBook.coverUrl}
          alt={featuredBook.title}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Featured Book
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{featuredBook.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {featuredBook.title}
          </h1>

          {/* Author and Genre */}
          <div className="flex items-center gap-4 mb-6 text-lg text-muted-foreground">
            <span>By {featuredBook.author}</span>
            <span>•</span>
            <span>{featuredBook.genre?.[0] || 'Fiction'}</span>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
            {featuredBook.description || 
            `Discover the captivating world of ${featuredBook.title} by ${featuredBook.author}. A masterpiece that will take you on an unforgettable journey through compelling characters and intricate storytelling.`}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Start Reading
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-muted-foreground/30 text-foreground hover:bg-muted/50 px-8 py-4 text-lg"
            >
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Fade to content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
