import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface AppDownloadBadgesProps {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AppDownloadBadges({ 
  variant = 'horizontal', 
  size = 'md',
  className = '' 
}: AppDownloadBadgesProps) {
  const { apkUrl } = useSiteSettings();

  const sizeClasses = {
    sm: 'h-9 text-xs px-3',
    md: 'h-10 text-sm px-4',
    lg: 'h-12 text-base px-6'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleDownload = () => {
    if (apkUrl) {
      const link = document.createElement('a');
      link.href = apkUrl;
      link.download = 'A2S-OTT.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.alert('APK not available yet. Please contact admin.');
    }
  };

  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} gap-3 ${className}`}>
      <Button
        onClick={handleDownload}
        className={`${sizeClasses[size]} gap-2`}
        variant="default"
      >
        <Download className={iconSizes[size]} />
        Download A2S OTT App
      </Button>
    </div>
  );
}
