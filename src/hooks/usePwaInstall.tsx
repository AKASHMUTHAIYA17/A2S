import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isIosDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroidDevice = () => /Android/i.test(navigator.userAgent);
const isMobileDevice = () => isIosDevice() || isAndroidDevice();
const isStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

// Store prompt globally so it persists across component re-renders
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export function usePwaInstall() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(!!globalDeferredPrompt);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
      console.log('[PWA] Install prompt captured and ready');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      globalDeferredPrompt = null;
      console.log('[PWA] App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!globalDeferredPrompt) {
      console.log('[PWA] No deferred prompt available');
      return false;
    }

    try {
      await globalDeferredPrompt.prompt();
      const { outcome } = await globalDeferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        globalDeferredPrompt = null;
      }

      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      return false;
    }
  }, []);

  return {
    isInstallable,
    isInstalled,
    isIosDevice: isIosDevice(),
    isAndroidDevice: isAndroidDevice(),
    isMobileDevice: isMobileDevice(),
    install,
  };
}
