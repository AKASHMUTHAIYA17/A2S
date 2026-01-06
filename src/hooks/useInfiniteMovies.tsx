import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbMovie, toFrontendMovie } from './useMovies';

const PAGE_SIZE = 12;

export function useInfiniteMovies(category: string = 'all') {
  return useInfiniteQuery({
    queryKey: ['infinite-movies', category],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('movies')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        movies: (data as DbMovie[]).map(toFrontendMovie),
        nextPage: (pageParam + 1) * PAGE_SIZE < (count || 0) ? pageParam + 1 : undefined,
        totalCount: count || 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}
