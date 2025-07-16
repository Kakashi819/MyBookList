import { useInfiniteQuery } from 'react-query';
import { apiClient, Book } from '@/lib/api';

export function useInfiniteBooks(params?: {
  search?: string;
  genre?: string;
  limit?: number;
}) {
  return useInfiniteQuery(
    ['books-infinite', params],
    async ({ pageParam: cursor }) => {
      const data = await apiClient.getBooks({
        ...params,
        cursor,
        limit: params?.limit || 20,
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );
}
