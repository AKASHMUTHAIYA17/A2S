import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DbMovie {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  video_url: string | null;
  trailer_url: string | null;
  category: string;
  year: number | null;
  rating: number | null;
  duration: string | null;
  maturity_rating: string | null;
  match_percentage: number | null;
  created_at: string;
  updated_at: string;
}

// Convert DB movie to frontend format
export const toFrontendMovie = (m: DbMovie) => ({
  id: m.id,
  title: m.title,
  description: m.description || '',
  poster: m.image || '',
  category: m.category,
  year: m.year || new Date().getFullYear(),
  rating: m.rating || 0,
  duration: m.duration || '',
  maturityRating: m.maturity_rating || 'PG-13',
  matchPercentage: m.match_percentage || 0,
  videoUrl: m.video_url || undefined,
  trailerUrl: m.trailer_url || undefined,
  genres: [],
});

export function useRealtimeMovies() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('movies-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movies' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['movies'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as DbMovie[]).map(toFrontendMovie);
    },
  });
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return toFrontendMovie(data as DbMovie);
    },
    enabled: !!id,
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (movie: Omit<DbMovie, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('movies')
        .insert(movie)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast({
        title: 'Movie added',
        description: 'The movie has been added successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...movie }: Partial<DbMovie> & { id: string }) => {
      const { data, error } = await supabase
        .from('movies')
        .update(movie)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', variables.id] });
      toast({
        title: 'Movie updated',
        description: 'The movie has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast({
        title: 'Movie deleted',
        description: 'The movie has been removed from the catalog.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
