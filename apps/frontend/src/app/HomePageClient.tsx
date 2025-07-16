'use client';

import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { BookCarousel } from '@/components/books/BookCarousel';
import { Book } from '@/lib/api';

export default function HomePageClient({ featuredBooks }: { featuredBooks: Book[] }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <div className="py-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8">Featured Books</h2>
            <BookCarousel books={featuredBooks} />
          </div>
        </div>
      </main>
    </div>
  );
}
