'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useUserLibrary, useUpdateBookStatus, useRemoveBookFromLibrary } from '@/hooks/useApi';
import { BookOpen, Heart, Clock, CheckCircle, Plus, Search, Filter, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(userBook => (
              <LibraryBookCard 
                key={userBook.bookId} 
                userBook={userBook}
                onStatusChange={handleStatusChange}
                onProgressUpdate={handleProgressUpdate}
                onRemove={handleRemoveBook}
                isUpdating={updateBookStatusMutation.isLoading}
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

interface LibraryBookCardProps {
  userBook: any;
  onStatusChange: (bookId: string, status: BookStatus) => void;
  onProgressUpdate: (bookId: string, progress: number) => void;
  onRemove: (bookId: string) => void;
  isUpdating: boolean;
}

function LibraryBookCard({ userBook, onStatusChange, onProgressUpdate, onRemove, isUpdating }: LibraryBookCardProps) {
  const statusConfig_local = statusConfig[userBook.status as BookStatus];
  const Icon = statusConfig_local.icon;
  const book = userBook.book;

  if (!book) return null;

  return (
    <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Image
            src={book.coverUrl || '/placeholder-book.jpg'}
            alt={book.title}
            width={80}
            height={120}
            className="w-16 h-24 object-cover rounded"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(userBook.bookId)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Status Dropdown */}
          <select
            value={userBook.status}
            onChange={(e) => onStatusChange(userBook.bookId, e.target.value as BookStatus)}
            disabled={isUpdating}
            className="text-xs border border-border rounded px-2 py-1 mb-2"
          >
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
          
          {userBook.status === 'reading' && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{userBook.progress || 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${userBook.progress || 0}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={userBook.progress || 0}
                onChange={(e) => onProgressUpdate(userBook.bookId, parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
          
          {userBook.userRating && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-muted-foreground">My Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-xs ${i < userBook.userRating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {userBook.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              "{userBook.notes}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
