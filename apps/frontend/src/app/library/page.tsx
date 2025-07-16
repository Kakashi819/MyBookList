'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useUserLibrary, useUpdateBookStatus, useRemoveBookFromLibrary } from '@/hooks/useApi';
import { BookOpen, Heart, Clock, CheckCircle, Plus, Search, Filter, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BookModal } from '@/components/books/BookModal';
import { BookCard } from '@/components/books/BookCard';

type BookStatus = 'reading' | 'completed' | 'wishlist' | 'dropped';

const statusConfig = {
  'wishlist': {
    label: 'Want to Read',
    icon: Plus,
    color: 'text-blue-600 bg-blue-100',
  },
  'reading': {
    label: 'Currently Reading',
    icon: BookOpen,
    color: 'text-orange-600 bg-orange-100',
  },
  'completed': {
    label: 'Read',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100',
  },
  'dropped': {
    label: 'Dropped',
    icon: Heart,
    color: 'text-gray-600 bg-gray-100',
  },
};

export default function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<BookStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  console.log('LibraryPage render', { selectedBookId });

  const { data: libraryBooks, isLoading, error } = useUserLibrary();
  const updateBookStatusMutation = useUpdateBookStatus();
  const removeBookMutation = useRemoveBookFromLibrary();

  // Filter books based on active tab and search
  const filteredBooks = libraryBooks?.filter(userBook => {
    const matchesTab = activeTab === 'all' || userBook.status === activeTab;
    const matchesSearch = userBook.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userBook.book?.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }) || [];

  const stats = {
    total: libraryBooks?.length || 0,
    reading: libraryBooks?.filter(b => b.status === 'reading').length || 0,
    completed: libraryBooks?.filter(b => b.status === 'completed').length || 0,
    wishlist: libraryBooks?.filter(b => b.status === 'wishlist').length || 0,
  };

  const handleStatusChange = async (bookId: string, status: BookStatus) => {
    try {
      await updateBookStatusMutation.mutateAsync({ bookId, data: { status } });
    } catch (error) {
      console.error('Failed to update book status:', error);
    }
  };

  const handleProgressUpdate = async (bookId: string, progress: number) => {
    try {
      await updateBookStatusMutation.mutateAsync({ bookId, data: { progress } });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    if (confirm('Are you sure you want to remove this book from your library?')) {
      try {
        await removeBookMutation.mutateAsync(bookId);
      } catch (error) {
        console.error('Failed to remove book:', error);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your library...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Sign in to view your library</h1>
            <p className="text-muted-foreground mb-6">
              Create an account or sign in to track your reading progress and build your personal library.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load your library. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BookModal
        bookId={selectedBookId}
        isOpen={selectedBookId !== null}
        onClose={() => setSelectedBookId(null)}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 mt-8">
          <h1 className="text-4xl font-bold mb-4">My Library</h1>
          <p className="text-xl text-muted-foreground">
            Track your reading journey and discover new books
          </p>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Books</div>
          </div>
          <div className="p-4 border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.reading}</div>
            <div className="text-sm text-muted-foreground">Currently Reading</div>
          </div>
          <div className="p-4 border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="p-4 border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.wishlist}</div>
            <div className="text-sm text-muted-foreground">Want to Read</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Link href="/books">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Books
            </Button>
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="rounded-full"
          >
            All Books ({stats.total})
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const count = status === 'wishlist' ? stats.wishlist : 
                         status === 'reading' ? stats.reading : 
                         status === 'completed' ? stats.completed :
                         libraryBooks?.filter(b => b.status === status).length || 0;
            
            return (
              <Button
                key={status}
                variant={activeTab === status ? 'default' : 'outline'}
                onClick={() => setActiveTab(status as BookStatus)}
                className="rounded-full"
              >
                <Icon className="h-4 w-4 mr-2" />
                {config.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your library...</p>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(userBook => (
              <BookCard
                key={userBook.bookId}
                book={userBook.book}
                onClick={bookId => setSelectedBookId(bookId)}
                className="h-fit"
              />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start building your library by adding some books!'}
            </p>
            <Link href="/books">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse Books
              </Button>
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}

// ...removed LibraryBookCard, now using BookCard everywhere...
