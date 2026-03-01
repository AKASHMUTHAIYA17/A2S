import { Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';

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
  const { isInstallable, isInstalled, install } = usePwaInstall();

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

  if (isInstalled) {
    return (
      <div className={`flex items-center gap-2 text-primary ${className}`}>
        <CheckCircle className={iconSizes[size]} />
        <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>App Installed!</span>
      </div>
    );
  }

  const handleDownload = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }

    const isPreviewHost = window.location.hostname.includes('id-preview--');
    const publishedUrl = 'https://a2sott.lovable.app';

    // In preview iframe, install prompt won't reliably appear, so open the live app URL
    window.open(isPreviewHost ? publishedUrl : window.location.origin, '_blank', 'noopener,noreferrer');
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
