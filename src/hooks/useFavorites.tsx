import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface Favorite {
  id: string;
  user_id: string;
  movie_id: string;
  is_liked: boolean;
  is_in_list: boolean;
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!user,
  });

  const toggleLike = useMutation({
    mutationFn: async (movieId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const existing = favorites.find(f => f.movie_id === movieId);
      
      if (existing) {
        const { error } = await supabase
          .from('user_favorites')
          .update({ is_liked: !existing.is_liked })
          .eq('id', existing.id);
        if (error) throw error;
        return !existing.is_liked;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, movie_id: movieId, is_liked: true, is_in_list: false });
        if (error) throw error;
        return true;
      }
    },
    onSuccess: (isLiked) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({ title: isLiked ? 'Added to liked' : 'Removed from liked' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    },
  });

  const toggleMyList = useMutation({
    mutationFn: async (movieId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const existing = favorites.find(f => f.movie_id === movieId);
      
      if (existing) {
        const { error } = await supabase
          .from('user_favorites')
          .update({ is_in_list: !existing.is_in_list })
          .eq('id', existing.id);
        if (error) throw error;
        return !existing.is_in_list;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, movie_id: movieId, is_liked: false, is_in_list: true });
        if (error) throw error;
        return true;
      }
    },
    onSuccess: (isInList) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({ title: isInList ? 'Added to My List' : 'Removed from My List' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    },
  });

  const isLiked = (movieId: string) => favorites.find(f => f.movie_id === movieId)?.is_liked ?? false;
  const isInList = (movieId: string) => favorites.find(f => f.movie_id === movieId)?.is_in_list ?? false;

  return {
    favorites,
    isLoading,
    toggleLike: toggleLike.mutate,
    toggleMyList: toggleMyList.mutate,
    isLiked,
    isInList,
  };
}
