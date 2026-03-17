import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { InstallInstructions } from './InstallInstructions';

export function InstallBanner() {
  const { isInstallable, isInstalled, isIosDevice, isAndroidDevice, isMobileDevice, install } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState<'ios' | 'android' | 'desktop' | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('install-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!isInstalled && (isInstallable || isMobileDevice)) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isMobileDevice]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('install-banner-dismissed', 'true');
  };

  const handleInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setIsVisible(false);
        return;
      }
    }
    
    // Show visual instructions
    if (isIosDevice) {
      setShowInstructions('ios');
    } else if (isAndroidDevice) {
      setShowInstructions('android');
    } else {
      setShowInstructions('desktop');
    }
  };

  if (!isVisible || isDismissed || isInstalled) return null;

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-[60] animate-slide-up">
        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl max-w-md mx-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">Download A2S OTT App</p>
            <p className="text-xs text-muted-foreground">Install for a better experience</p>
          </div>
          <Button size="sm" onClick={handleInstall} className="flex-shrink-0">
            Install
          </Button>
          <button onClick={handleDismiss} className="p-1 text-muted-foreground hover:text-foreground flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
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
