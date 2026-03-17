import { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { InstallInstructions } from './InstallInstructions';

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
  const { isInstallable, isInstalled, isIosDevice, isAndroidDevice, isMobileDevice, install } = usePwaInstall();
  const [showInstructions, setShowInstructions] = useState<'ios' | 'android' | 'desktop' | null>(null);

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
      // Try native install prompt first
      if (isInstallable) {
        const accepted = await install();
        if (accepted) return;
      }

      // Show visual instructions as fallback
      if (isIosDevice) {
        setShowInstructions('ios');
      } else if (isAndroidDevice) {
        setShowInstructions('android');
      } else {
        setShowInstructions('desktop');
      }
    } catch (error) {
      console.error('Install flow failed:', error);
      if (isMobileDevice) {
        setShowInstructions(isIosDevice ? 'ios' : 'android');
      } else {
        setShowInstructions('desktop');
      }
    }
  };

  return (
    <>
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

      {showInstructions && (
        <InstallInstructions
          platform={showInstructions}
          onClose={() => setShowInstructions(null)}
        />
      )}
    </>
  );
}
