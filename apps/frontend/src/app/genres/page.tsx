'use client';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useGenres } from '@/hooks/useGenres';
import { ArrowRight, BookOpen, Heart, Zap, Globe, Users, Star, Brain, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

// A simple hash function to generate a color from a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// Default genre configurations with icons and colors
const genreConfig: Record<string, { icon: any; color: string; description: string }> = {
  'fiction': {
    icon: BookOpen,
    color: 'bg-blue-500',
    description: 'Imaginative stories that transport you to different worlds'
  },
  'romance': {
    icon: Heart,
    color: 'bg-pink-500',
    description: 'Love stories that will make your heart flutter'
  },
  'thriller': {
    icon: Zap,
    color: 'bg-red-500',
    description: 'Heart-pounding stories full of suspense and excitement'
  },
  'science fiction': {
    icon: Globe,
    color: 'bg-purple-500',
    description: 'Futuristic tales exploring technology and space'
  },
  'fantasy': {
    icon: Star,
    color: 'bg-green-500',
    description: 'Magical worlds filled with mythical creatures and adventures'
  },
  'mystery': {
    icon: Brain,
    color: 'bg-orange-500',
    description: 'Puzzling cases and detective stories to solve'
  },
  'biography': {
    icon: Users,
    color: 'bg-teal-500',
    description: 'Real-life stories of remarkable people'
  },
  'history': {
    icon: BookOpen,
    color: 'bg-amber-500',
    description: 'Explore the past and learn from historical events'
  },
  'non-fiction': {
    icon: BookOpen,
    color: 'bg-gray-500',
    description: 'Factual books covering various real-world topics'
  }
};

export default function GenresPage() {
  const { data: genres, isLoading, error } = useGenres();
  const [searchTerm, setSearchTerm] = useState('');

  const processedGenres = useMemo(() => {
    if (!genres) return [];
    return genres.map(genre => {
      const config = genreConfig[genre.name.toLowerCase()];
      const color = config ? config.color : ''; // We will handle the color in the component
      return {
        ...genre,
        icon: config ? config.icon : BookOpen,
        color: color,
        description: config ? config.description : `Discover books in the ${genre.name} genre`,
      };
    }).sort((a, b) => (b.bookCount || 0) - (a.bookCount || 0));
  }, [genres]);

  // Find featured genre (most popular)
  const featuredGenre = processedGenres[0];

  // Filter genres based on search
  const filteredGenres = processedGenres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGenres = processedGenres.length;
  const totalBooks = useMemo(() => {
    if (!processedGenres) return 0;
    return processedGenres.reduce((acc, genre) => acc + (genre.bookCount || 0), 0);
  }, [processedGenres]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load genres. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Genres</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover books across different genres and find your next favorite read
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading genres...</p>
          </div>
        )}

        {!isLoading && processedGenres.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No genres found</h3>
            <p className="text-muted-foreground mb-6">Come back later to see genres for our books.</p>
            <Link href="/books">
              <Button>Browse All Books</Button>
            </Link>
          </div>
        )}

        {/* Featured Genre */}
        {!isLoading && featuredGenre && !searchTerm && (
          <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full mb-4">
                  Most Popular Genre
                </span>
                <h2 className="text-3xl font-bold mb-4">{featuredGenre.name}</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {featuredGenre.description}
                </p>
                <Link href={`/books?genre=${featuredGenre.name}`}>
                  <Button size="lg">
                    Explore {featuredGenre.name} Books
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <div className={`w-32 h-32 ${featuredGenre.color} rounded-full flex items-center justify-center mb-4`}>
                  <featuredGenre.icon className="h-16 w-16 text-white" />
                </div>
                <p className="text-2xl font-bold">{featuredGenre.bookCount}+</p>
                <p className="text-muted-foreground">Books Available</p>
              </div>
            </div>
          </div>
        )}

        {/* Genres Grid */}
        {!isLoading && filteredGenres.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGenres.map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        )}

        {/* Stats Section */}
        {!isLoading && processedGenres.length > 0 && (
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-8">By the Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">{totalBooks.toLocaleString()}</div>
                <div className="text-lg text-muted-foreground">Total Books</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">{totalGenres}</div>
                <div className="text-lg text-muted-foreground">Available Genres</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.round(totalBooks / Math.max(totalGenres, 1))}
                </div>
                <div className="text-lg text-muted-foreground">Avg Books per Genre</div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm && filteredGenres.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No genres found</h3>
            <p className="text-muted-foreground mb-6">
              No genres match your search for "{searchTerm}"
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function GenreCard({ genre }: { genre: any }) {
  const Icon = genre.icon;
  const bgColor = genre.color ? genre.color : ''; // Use predefined color if available
  const dynamicStyle = genre.color ? {} : { backgroundColor: stringToColor(genre.name) };

  return (
    <Link href={`/books?genre=${encodeURIComponent(genre.name)}`}>
      <div className="group p-6 border border-border rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-accent/50">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
            style={dynamicStyle}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {genre.name}
            </h3>
            <p className="text-sm text-muted-foreground">{genre.bookCount} books</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {genre.description}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            Explore {genre.name}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
