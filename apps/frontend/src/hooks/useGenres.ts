import { useQuery } from 'react-query';
import { apiClient } from '@/lib/api';

export function useGenres() {
  return useQuery('genres', () => apiClient.getGenres(), {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
