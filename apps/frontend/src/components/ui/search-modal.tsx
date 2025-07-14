'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl mt-20 mx-4">
        <div className="bg-background/95 backdrop-blur-md rounded-lg border border-border/40 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {searchQuery && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Showing results for "{searchQuery}"
              </div>
              <div className="text-sm text-muted-foreground">
                Search functionality coming soon...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
