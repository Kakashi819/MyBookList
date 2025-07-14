'use client';

import { Button } from '@/components/ui/button';
import { Search, BookOpen, Star, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover Your Next
            <span className="text-primary block">Great Read</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your reading journey, discover new books, and connect with fellow book lovers
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6">
              <Search className="mr-2 h-5 w-5" />
              Explore Books
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Reading List
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-muted-foreground">Books Available</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-muted-foreground">Reviews & Ratings</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">5,000+</div>
              <div className="text-muted-foreground">Active Readers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
