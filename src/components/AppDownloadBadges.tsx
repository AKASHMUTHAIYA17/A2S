import { Download, CheckCircle, Smartphone } from 'lucide-react';
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

  if (isInstallable) {
    return (
      <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} gap-3 ${className}`}>
        <Button
          onClick={install}
          className={`${sizeClasses[size]} gap-2`}
          variant="default"
        >
          <Download className={iconSizes[size]} />
          Install A2S OTT App
        </Button>
      </div>
    );
  }

  // Fallback: show instructions for browsers that don't support install prompt
  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} gap-3 ${className}`}>
      <div className={`flex items-center gap-2 ${sizeClasses[size]} bg-secondary rounded-lg border border-border px-3`}>
        <Smartphone className={iconSizes[size]} />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] text-muted-foreground">Open in browser &</span>
          <span className="font-semibold text-xs">Add to Home Screen</span>
        </div>
      </div>
    </div>
  );
}
