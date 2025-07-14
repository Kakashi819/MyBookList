// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface CreateCommentRequest {
  book_id: string;
  content: string;
  rating?: number;
}

export interface UpdateCommentRequest {
  content?: string;
  rating?: number;
}

export interface BookFilterRequest {
  search?: string;
  genres?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'title' | 'publishedYear' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface UserStatsRequest {
  userId: string;
}

// Environment configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface ApiConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  jwtSecret: string;
  corsOrigin: string[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey: string;
}
