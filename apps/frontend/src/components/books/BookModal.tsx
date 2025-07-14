'use client';

import { useState } from 'react';
import { X, Play, Plus, Star, BookOpen, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBook, useAddBookToLibrary, useUpdateBookStatus } from '@/hooks/useApi';
import { useAuth } from '@/components/providers/AuthProvider';
import Image from 'next/image';

interface BookModalProps {
  bookId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookModal({ bookId, isOpen, onClose }: BookModalProps) {
  const [readingStatus, setReadingStatus] = useState<'wishlist' | 'reading' | 'completed' | 'dropped'>('wishlist');
  const { user } = useAuth();
  const { data: book, isLoading, error } = useBook(bookId || '');
  const addToLibraryMutation = useAddBookToLibrary();
  const updateBookMutation = useUpdateBookStatus();

  if (!isOpen || !bookId) return null;

  const handleAddToLibrary = async (status: 'wishlist' | 'reading' | 'completed' | 'dropped') => {
    if (!user) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      await addToLibraryMutation.mutateAsync({ bookId, status });
      setReadingStatus(status);
    } catch (error) {
      console.error('Failed to add book to library:', error);
    }
  };

  const handleUpdateStatus = async (status: 'wishlist' | 'reading' | 'completed' | 'dropped') => {
    if (!user) return;

    try {
      await updateBookMutation.mutateAsync({ 
        bookId, 
        data: { status } 
      });
      setReadingStatus(status);
    } catch (error) {
      console.error('Failed to update book status:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-background rounded-lg overflow-hidden">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
        >
          <X className="h-4 w-4" />
        </Button>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4 w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded mb-2 w-1/2 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-primary">Failed to load book details.</p>
          </div>
        ) : book ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80">
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={120}
                      height={180}
                      className="rounded-lg shadow-2xl"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                      {book.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      by {book.author}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{book.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{book.publishedYear || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{book.genre?.[0] || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleAddToLibrary('reading')}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Reading
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => handleAddToLibrary('wishlist')}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">About this book</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.description || 
                    `Discover the world of "${book.title}" by ${book.author}. This compelling ${book.genre?.[0]?.toLowerCase() || 'book'} takes readers on an unforgettable journey through masterful storytelling and rich character development.`}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Book Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Author:</span>
                        <span>{book.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Published:</span>
                        <span>{book.publishedYear || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Genre:</span>
                        <span>{book.genre?.[0] || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {book.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user && (
                    <div>
                      <h3 className="font-semibold mb-2">My Reading Status</h3>
                      <div className="space-y-2">
                        {(['wishlist', 'reading', 'completed', 'dropped'] as const).map((status) => (
                          <Button
                            key={status}
                            variant={readingStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateStatus(status)}
                            className="w-full justify-start"
                          >
                            {status === 'wishlist' && <Plus className="mr-2 h-3 w-3" />}
                            {status === 'reading' && <BookOpen className="mr-2 h-3 w-3" />}
                            {status === 'completed' && <Star className="mr-2 h-3 w-3" />}
                            {status === 'dropped' && <X className="mr-2 h-3 w-3" />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
