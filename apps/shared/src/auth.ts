export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Comment {
  id: string;
  book_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  likes: number;
  replies?: Comment[];
}

export interface AdminStats {
  totalUsers: number;
  totalBooks: number;
  totalComments: number;
  pendingComments: number;
  activeUsers: number;
}
