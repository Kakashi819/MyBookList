import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border/40' 
          : 'bg-gradient-to-b from-background/80 to-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl text-foreground">MyBookList</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                Home
              </Link>
              <Link href="/books" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Books
              </Link>
              <Link href="/genres" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Genres
              </Link>
              {user && (
                <Link href="/library" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  My Library
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline ml-2 text-sm">{user.email}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-muted/50">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline ml-2 text-sm">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm" className="hover:bg-muted/50">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">Sign Up</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden hover:bg-muted/50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/40">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                  Home
                </Link>
                <Link href="/books" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Books
                </Link>
                <Link href="/genres" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Genres
                </Link>
                {user && (
                  <Link href="/library" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    My Library
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
