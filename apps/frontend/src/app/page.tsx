'use client';

import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/sections/HeroSection'
import { BookCarousel } from '@/components/books/BookCarousel'
import { GenreFilter } from '@/components/books/GenreFilter'
import { useBooks } from '@/hooks/useApi'

export default function HomePage() {
  const { data: booksData, isLoading, error } = useBooks();
  
  // Extract books array from the API response
  const books = booksData?.books || [];
  
  // Get popular books (highest rated)
  const popularBooks = books
    .filter(book => book.rating && book.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);

  // Get recently added books (mock as we don't have dateAdded in API)
  const recentBooks = books.slice(0, 10);

  // Get trending books (for demo, using highly rated books)
  const trendingBooks = books
    .filter(book => book.rating && book.rating >= 3.8)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(5, 15); // Different slice to show variety

  return (
    <main className="min-h-screen bg-background pt-16">
      <Header />
      <HeroSection />
      
      {error ? (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-primary">Failed to load books. Please try again later.</p>
          </div>
        </div>
      ) : null}
      
      <div className="container mx-auto px-4 py-12 space-y-8">
        <GenreFilter books={books} isLoading={isLoading} />
        
        <BookCarousel 
          title="Trending Now" 
          books={trendingBooks}
          isLoading={isLoading}
        />
        
        <BookCarousel 
          title="Popular This Week" 
          books={popularBooks}
          isLoading={isLoading}
        />
        
        <BookCarousel 
          title="Recently Added" 
          books={recentBooks}
          isLoading={isLoading}
        />
        
        <BookCarousel 
          title="Highly Rated" 
          books={popularBooks}
          isLoading={isLoading}
        />
      </div>
    </main>
  )
}
