export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  rating: number;
  totalRatings: number;
  genre: string[];
  publishedYear: number;
  pages: number;
  isbn: string;
  language: string;
  publisher: string;
  isFeatured?: boolean;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  birthYear: number;
  nationality: string;
  totalBooks: number;
}

export interface UserBook {
  bookId: string;
  status: 'reading' | 'completed' | 'wishlist' | 'dropped';
  userRating?: number;
  progress?: number;
  dateAdded: string;
  dateCompleted?: string;
}

export interface Genre {
  id: string;
  name: string;
  color: string;
  description: string;
}
