import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      if (error) throw error;
      const map: Record<string, string | null> = {};
      data?.forEach((row) => { map[row.key] = row.value; });
      return map;
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

  const updateSetting = async (key: string, value: string | null) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    if (error) throw error;
  };

  const updateLogo = (url: string | null) => updateSetting('logo_url', url);
  const updateApkUrl = (url: string | null) => updateSetting('apk_url', url);

  return {
    logoUrl: (settings?.logo_url ?? null) as string | null,
    apkUrl: (settings?.apk_url ?? null) as string | null,
    isLoading,
    updateLogo,
    updateApkUrl,
  };
}
