import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data: logoUrl, isLoading } = useQuery({
    queryKey: ['site-settings', 'logo_url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'logo_url')
        .single();
      if (error) throw error;
      return data?.value || null;
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('site-settings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['site-settings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const updateLogo = async (url: string | null) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: url })
      .eq('key', 'logo_url');
    if (error) throw error;
  };

  return { logoUrl: logoUrl as string | null, isLoading, updateLogo };
}
