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
  const { isInstallable, isInstalled, isIosDevice, isMobileDevice, install } = usePwaInstall();

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
    try {
      if (isInstallable) {
        await install();
        return;
      }

      if (isIosDevice) {
        window.alert('To install:\n1. Tap the Share button (□↑) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install the app');
      } else if (isMobileDevice) {
        window.alert('To install:\n1. Tap the browser menu (⋮) at the top right\n2. Tap "Install app" or "Add to Home screen"\n3. The app will be added to your home screen');
      } else {
        window.alert('To install:\nClick the install icon (⊕) in your browser address bar, or open this site on your phone to install the mobile app.');
      }
    } catch (error) {
      console.error('Install flow failed:', error);
      window.alert('Install failed. Please try again.');
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
        Install A2S OTT App
      </Button>
    </div>
  );
}
